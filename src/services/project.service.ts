import mongoose from "mongoose";
import Project from "@/models/database/Project";
import { getNextSequence } from "@/utils/getNextSequence";
import type { IProject } from "@/models/database/Project/ProjectSchema";
import { ProjectFormData } from "@/shared-types/Form-data";
import { EUserLevel } from "@/shared-types/Common/role";
import { throwError } from "@/utils/ApiResponse";

export const registerDevice = async (formData: ProjectFormData.IRegisterDevice) => {
  const existingProject = await Project.findOne({
    macId: formData.macId,
    isDelete: false
  });

  if (existingProject) {
    return existingProject;
  }

  const number = await getNextSequence("project");

  const project = await Project.create({
    number,
    wifiName: formData.wifiName,
    macId: formData.macId
  });

  return project;
};

export const create = async (
  formData: ProjectFormData.ICreateProject,
  userId: string
): Promise<IProject> => {
  const number = await getNextSequence("project");

  const project = await Project.create({
    ...formData,
    number,
    createdBy: userId
  });

  if (!project) {
    return throwError(500, "Không thể tạo project");
  }

  return project;
};

export const getList = async ({
  level,
  userId,
  page = 1,
  limit = 20,
  search
}: ProjectFormData.IGetList) => {
  const filter: Record<string, unknown> = {
    isDelete: false,
    $or:[
      {employeeIds: userId},
      {createdBy: userId}
    ]
  };

  if (level === EUserLevel.STAFF) {
    filter.employeeIds = new mongoose.Types.ObjectId(userId);
  }

  if (search?.trim()) {
    const searchRegex = {
      $regex: search,
      $options: "i"
    };

    filter.$or = [{ name: searchRegex }, { wifiName: searchRegex }, { macId: searchRegex }];
  }

  const [rows, count] = await Promise.all([
    Project.find(filter)
      .sort({ number: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("employeeIds", "fullname")
      .lean(),

    Project.countDocuments(filter)
  ]);

  return {
    rows,
    count,
    page,
    limit
  };
};

export const getDetail = async (id: string) => {
  const project = await Project.findOne({
    _id: id,
    isDelete: false
  }).populate("employeeIds", "fullname");

  if (!project) {
    return throwError(404, "Không tìm thấy project");
  }

  return project;
};

export const update = async (
  id: string,
  formData: ProjectFormData.IUpdateProject,
  userId: string
) => {
  const project = await Project.findOne({
    _id: id,
    isDelete: false
  });

  if (!project) {
    return throwError(404, "Không tìm thấy project");
  }

  if (formData.name !== undefined) {
    project.name = formData.name;
  }

  if (formData.employeeIds !== undefined) {
    project.employeeIds = formData.employeeIds.map((id) => new mongoose.Types.ObjectId(id));
  }

  if (formData.description !== undefined) {
    project.description = formData.description;
  }

  if (formData.wifiName !== undefined) {
    project.wifiName = formData.wifiName;
  }

  if (formData.macId !== undefined) {
    project.macId = formData.macId;
  }

  project.address ??= {
    latitude: 0,
    longitude: 0,
    detail: ""
  };

  if (formData.address?.latitude !== undefined) {
    project.address!.latitude = formData.address.latitude;
  }
  if (formData.address?.longitude !== undefined) {
    project.address!.longitude = formData.address.longitude;
  }
  if (formData.address?.detail !== undefined) {
    project.address!.detail = formData.address.detail;
  }

  project.createdBy = new mongoose.Types.ObjectId(userId);
  await project.save();

  return project;
};

export const remove = async (id: string) => {
  const project = await Project.findOne({
    _id: id,
    isDelete: false
  });

  if (!project) {
    return throwError(404, "Không tìm thấy project");
  }

  project.isDelete = true;

  await project.save();

  return {
    id: project._id.toString()
  };
};

export const selectionByWifiName = async (wifiName: string) => {
  return await Project.find({ wifiName, isDelete: false, createdBy: { $exists: false} }).sort({ createdAt: -1 }).lean();
};
