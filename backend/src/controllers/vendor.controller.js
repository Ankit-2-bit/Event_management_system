import Order from '../models/Order.js'
import Product from '../models/Product.js'
import RequestItem from '../models/RequestItem.js'
import User from '../models/User.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'

export const getVendorDashboard = asyncHandler(async (req, res) => {
  const [products, requests, pendingOrders] = await Promise.all([
    Product.countDocuments({ vendor: req.user._id }),
    RequestItem.countDocuments({ vendor: req.user._id }),
    Order.countDocuments({
      'items.vendorId': req.user._id,
      status: { $in: ['received', 'ready_for_shipping', 'out_for_delivery'] },
    }),
  ])

  res.status(200).json(new ApiResponse(200, { products, requests, pendingOrders }, 'Vendor dashboard loaded'))
})

export const updateVendorProfile = asyncHandler(async (req, res) => {
  const { profileImage, phone, category } = req.body

  const vendor = await User.findById(req.user._id)

  if (!vendor) {
    throw new ApiError(404, 'Vendor not found')
  }

  if (profileImage) {
    vendor.profileImage = profileImage
  }
  if (phone) {
    vendor.phone = phone
  }
  if (category) {
    vendor.category = category
  }

  await vendor.save()

  res.status(200).json(new ApiResponse(200, vendor, 'Vendor profile updated successfully'))
})

export const createRequestItem = asyncHandler(async (req, res) => {
  const { itemName, details } = req.body

  if (!itemName || !details) {
    throw new ApiError(400, 'itemName and details are required')
  }

  const request = await RequestItem.create({
    vendor: req.user._id,
    itemName,
    details,
  })

  res.status(201).json(new ApiResponse(201, request, 'Request item created'))
})

export const getVendorRequests = asyncHandler(async (req, res) => {
  const requests = await RequestItem.find({ vendor: req.user._id }).sort({ createdAt: -1 })
  res.status(200).json(new ApiResponse(200, requests, 'Vendor requests fetched'))
})
