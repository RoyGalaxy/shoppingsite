const express = require('express');
const Order = require('../models/Order.js');
const Restaurant = require('../models/Restaurant.js');
const User = require('../models/User.js');
const { verifyTokenAndSuperAdmin } = require('./verifyToken.js');

const router = express.Router();

router.get('/dashboard-metrics', verifyTokenAndSuperAdmin, async (req, res) => {
  try {
    // Get total orders
    const totalOrders = await Order.countDocuments();
    
    // Get total restaurants
    const totalRestaurants = await Restaurant.countDocuments();
    
    // Calculate total revenue from all orders
    const orders = await Order.find();
    const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0) || 0;
    
    // Get total users
    const totalUsers = await User.countDocuments({role: 'user'});

    const formattedMetrics = [
      { title: 'Total Orders', value: totalOrders.toString()},
      { title: 'Total Restaurants', value: totalRestaurants.toString()},
      { title: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`},
      { title: 'Total Users', value: totalUsers.toLocaleString()},
    ];

    res.json(formattedMetrics);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

router.get('/recent-activity', verifyTokenAndSuperAdmin, async (req, res) => {
  try {
    // Get recent orders (last 10)
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate({
        path: 'userId',
        model: 'User',
        select: 'name'
      })
      .populate({
        path: 'restaurantId',
        model: 'Restaurant',
        select: 'name'
      });

    // Format the activity data
    const activities = recentOrders.map(order => ({
      type: 'order',
      id: order._id,
      timestamp: order.createdAt,
      details: {
        userName: order.userId?.name || 'Anonymous',
        restaurantName: order.restaurantId?.name || 'Unknown Restaurant',
        amount: `$${order.amount.toLocaleString()}`,
        status: order.status
      }
    }));

    res.json(activities);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({ error: 'Failed to fetch recent activity' });
  }
});


module.exports = router;
