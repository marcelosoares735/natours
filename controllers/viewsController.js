const Tour = require('../models/tourModel');
const User = require('../models/userModel');
// const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Booking = require('../models/bookingModel');

const csp =
  "default-src 'self' https://js.stripe.com/v3/ https://cdnjs.cloudflare.com https://api.mapbox.com; base-uri 'self'; block-all-mixed-content; connect-src 'self' https://js.stripe.com/v3/ https://cdnjs.cloudflare.com/ https://*.mapbox.com/; font-src 'self' https://fonts.google.com/ https: data:;frame-ancestors 'self'; img-src 'self' data:; object-src 'none'; script-src 'self' https://js.stripe.com/v3/ https://cdnjs.cloudflare.com/ https://api.mapbox.com/ blob:; script-src-attr 'none'; style-src 'self' https: 'unsafe-inline'; upgrade-insecure-requests;";

exports.getLoginForm = catchAsync(async (req, res, next) => {
  res.status(200).set('Content-Security-Policy', csp).render('login', {
    title: 'Log into your account',
  });
});

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();

  // 2) build the template

  // 3) render that template using data from 1)
  res.status(200).set('Content-Security-Policy', csp).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    select: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name!', 404));
  }

  res
    .status(200)
    .set('Content-Security-Policy', csp)
    .render('tour', {
      title: `${tour.name} tour`,
      tour,
    });
});

exports.getAccount = catchAsync(async (req, res) => {
  res
    .status(200)
    .set('Content-Security-Policy', csp)
    .render('account', { title: 'account page' });
});

exports.updateUserData = catchAsync(async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).set('Content-Security-Policy', csp).render('account', {
    title: 'account page',
    user: updatedUser,
  });
});

exports.getMyBookings = catchAsync(async (req, res, next) => {
  // 1) Find all bookings from the user
  console.log('aaaaa');

  const bookings = await Booking.find({ user: req.user.id });
  // 2) finda all tours from those bookings
  const tourIDs = bookings.map((el) => el.tour);

  // returns all entries where the id is 'in'(contained in) the array tourIDs
  const tours = await Tour.find({ _id: { $in: tourIDs } });
  console.log(tours);
  res.status(200).set('Content-Security-Policy', csp).render('overview', {
    title: 'My Bookings',
    tours,
  });
});
