import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { errorHandler } from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import cloudinary from "cloudinary";
import { generateToken } from "../utils/jwtToken.js";

export const patientRegister = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, phone, nic, dob, gender, password } = req.body;

    if (
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !nic ||
        !dob ||
        !gender ||
        !password
    ) {
        return next(new errorHandler('Please enter all fields', 400));
    }
    const isRegister = await User.findOne({ email });
    if (isRegister) {
        return next(new errorHandler('User already registerd '))
    }

    const user = await User.create({
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        password,
        role: "Patient",
    });
    generateToken(user, "Registered Successfully", 201, res);
});

export const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password, confirmPassword, role } = req.body;
    if (!email || !password || !confirmPassword || !role) {
        return next(new errorHandler('Please enter all fields', 400));
    }

    if (password !== confirmPassword) {
        return next(new errorHandler('Password does not match', 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new errorHandler('User not registered', 400));
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
        return next(new errorHandler('Invalid email or password', 400));
    }

    if (role !== user.role) {
        return next(new errorHandler('User not found with this role', 400))
    }

    generateToken(user, "Login Successfully", 200, res);
});

export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
    const {firstName, lastName, email, phone, nic, dob, gender, password} = req.body;

    if (!firstName || !lastName || !email || !phone || !nic || !dob || !gender || !password) {
        return next( new errorHandler('Please enter all fields', 400));
    }

    const isAdmin = await User.find({ email});
    if (isAdmin) {
        return next( new errorHandler('Admin already registered wtih this email', 400));
    }

    const admin = await User.create({
        firstName, 
        lastName, 
        email,
        phone,
        nic,
        dob,
        gender,
        password,
        role: "Admin"
    });

    res.status(201).json({
        success: true,
        message: "Admin added successfully",
        admin
    });
});

export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.doctorAvatar) {
        return next(new errorHandler('Please upload doctor avatar', 400));
    }

    const { docAvatar } = req.files;
    const allowedFormats = ["image/jpg", "image/jpeg", "image/png"];
    if (!allowedFormats.includes(docAvatar.mimetype)) {
        return next(new errorHandler('Please upload a valid image file (jpg, jpeg, png)', 400));
    }
    const {
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        password,
        doctorDepartment
    } = req.body;

    if (!firstName || !lastName || !email || !phone || !nic || !dob || !gender || !password || !doctorDepartment) {
        return next(new errorHandler('Please enter all fields', 400));
    }
    const isRegister = await User.findOne({ email });
    if (isRegister) {
        return next(new errorHandler('Doctor already registerd with this email', 400));
    };

    
})