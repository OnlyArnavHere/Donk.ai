import { asyncHandler } from '../utils/asyncHandler.js'; import { send } from '../utils/response.js'; import * as service from '../services/auth.service.js';
export const register = asyncHandler(async (req,res) => send(res,{status:201,message:'Registered',data:await service.register(req.body)}));
export const login = asyncHandler(async (req,res) => send(res,{message:'Logged in',data:await service.login(req.body)}));
export const refresh = asyncHandler(async (req,res) => send(res,{message:'Token refreshed',data:await service.refresh(req.body.refreshToken)}));
export const logout = asyncHandler(async (req,res) => { await service.logout(req.body.refreshToken); send(res,{message:'Logged out'}); });
export const me = asyncHandler(async (req,res) => send(res,{data:req.user}));
