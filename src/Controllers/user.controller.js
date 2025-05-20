import User from '../Models/user.model.js';
import ApiError from '../Utils/apiErrors.js';
import ApiResponse from '../Utils/apiResponse.js';
import asyncHandler from '../Utils/asyncHandler.js';

const registerUser = asyncHandler(async (req, res) => {
  // Get Value form Client
  const { fullName, email, password, confirmPassword, gender, avatar } = req.body;
  //   Check Validation
  if ((!fullName, !email, !password, !confirmPassword, !gender, !avatar)) {
    throw new ApiError(400, 'All field are required');
  }
  if (
    [fullName, email, password, confirmPassword, gender, avatar].some(
      (field) => field.trim() === ''
    )
  ) {
    throw new ApiError(400, 'All fields must have some value');
  }
  //   Check User Exist or not
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'User Already Exist');
  }
  //   Create User
  const user = await user.create({
    fullName,
    email,
    password,
    confirmPassword,
    gender,
    avatar,
  });
  const createUser = await User.findById(user._id).select('-password -refreshToken');
  console.log(createUser);
  if (!createUser) {
    throw new ApiError(500, 'Failed to create user');
  }
  res.status(200).json(new ApiResponse(200, createUser, 'User Create Successfully'));
});

export { registerUser };
