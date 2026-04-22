import RequestItem from '../models/RequestItem.js'
import User from '../models/User.js'
import Membership from '../models/Membership.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [users, vendors, memberships, openRequests] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    User.countDocuments({ role: 'vendor' }),
    Membership.countDocuments(),
    RequestItem.countDocuments({ status: 'pending' }),
  ])

  res
    .status(200)
    .json(new ApiResponse(200, { users, vendors, memberships, openRequests }, 'Admin dashboard loaded'))
})

export const getUsers = asyncHandler(async (req, res) => {
  const { role } = req.query
  const filter = {}

  if (role && role !== 'all') {
    filter.role = role
  }

  const users = await User.find(filter).select('-password').sort({ createdAt: -1 })

  res.status(200).json(new ApiResponse(200, users, 'Users fetched successfully'))
})

export const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  if (user.role === 'admin' && String(user._id) === String(req.user._id)) {
    throw new ApiError(400, 'Admin cannot disable own account')
  }

  user.isActive = !user.isActive
  await user.save()

  res.status(200).json(new ApiResponse(200, user, 'User status updated'))
})

export const getVendorRequests = asyncHandler(async (req, res) => {
  const requests = await RequestItem.find()
    .populate('vendor', 'name email category')
    .sort({ createdAt: -1 })

  res.status(200).json(new ApiResponse(200, requests, 'Vendor requests fetched'))
})

export const updateVendorRequestStatus = asyncHandler(async (req, res) => {
  const { status } = req.body

  if (!['pending', 'approved', 'rejected'].includes(status)) {
    throw new ApiError(400, 'Invalid request status value')
  }

  const request = await RequestItem.findById(req.params.id)

  if (!request) {
    throw new ApiError(404, 'Request not found')
  }

  request.status = status
  await request.save()

  res.status(200).json(new ApiResponse(200, request, 'Request status updated'))
})

export const cancelUserMembership = asyncHandler(async (req, res) => {
  const userId = req.params.userId

  const user = await User.findById(userId).populate('membership')

  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  if (!user.membership) {
    throw new ApiError(400, 'User does not have any active membership')
  }

  const membershipId = user.membership._id

  // Delete membership from database
  await Membership.findByIdAndDelete(membershipId)

  // Remove membership reference from user
  user.membership = null
  await user.save()

  res.status(200).json(new ApiResponse(200, { user }, 'User membership cancelled and deleted successfully'))
})
