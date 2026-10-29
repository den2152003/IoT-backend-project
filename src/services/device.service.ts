import mongoose from "mongoose";
import Device from "@/models/database/Device";
import Node from "@/models/database/Node";
import Project from "@/models/database/Project";
import { DeviceFormData } from "@/shared-types/Form-data";
import { throwError } from "@/utils/ApiResponse";
import { publishDeviceCommand } from "@/mqtt/publisher";

export const create = async (formData: DeviceFormData.ICreateDevice) => {
  const node = await Node.findOne({
    _id: formData.nodeId,
    isDelete: false
  });

  if (!node) {
    throw throwError(404, "Không tìm thấy node");
  }

  return Device.create({
    ...formData,
    nodeId: node._id
  });
};

export const getList = async ({
  page = 1,
  limit = 20,
  search,
  nodeId
}: DeviceFormData.IGetList) => {
  const filter: Record<string, unknown> = {
    isDelete: false
  };

  if (nodeId) {
    if (!mongoose.Types.ObjectId.isValid(nodeId)) {
      throw throwError(400, "Node ID không hợp lệ");
    }

    filter.nodeId = new mongoose.Types.ObjectId(nodeId);
  }

  if (search?.trim()) {
    filter.name = {
      $regex: search.trim(),
      $options: "i"
    };
  }

  const [rows, count] = await Promise.all([
    Device.find(filter)
      .populate("nodeId", "name number macId wifiName gatewayId")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),

    Device.countDocuments(filter)
  ]);

  return {
    rows,
    count,
    page,
    limit
  };
};

export const getDetail = async (id: string) => {
  const device = await Device.findOne({
    _id: id,
    isDelete: false
  }).populate("nodeId", "name number macId wifiName gatewayId");

  if (!device) {
    throw throwError(404, "Không tìm thấy device");
  }

  return device;
};

export const update = async (id: string, formData: DeviceFormData.IUpdateDevice) => {
  const device = await Device.findOne({
    _id: id,
    isDelete: false
  });

  if (!device) {
    throw throwError(404, "Không tìm thấy device");
  }

  if (formData.name !== undefined) {
    device.name = formData.name;
  }

  if (formData.description !== undefined) {
    device.description = formData.description;
  }

  if (formData.pin !== undefined) {
    device.pin = formData.pin;
  }

  if (formData.turn !== undefined) {
    device.turn = formData.turn;
  }

  await device.save();

  return device;
};

export const remove = async (id: string) => {
  const device = await Device.findOne({
    _id: id,
    isDelete: false
  });

  if (!device) {
    throw throwError(404, "Không tìm thấy device");
  }

  device.isDelete = true;

  await device.save();

  return {
    id: device._id.toString()
  };
};

export const control = async (id: string, formData: DeviceFormData.ICommand) => {
  const device = await Device.findOne({
    _id: id,
    isDelete: false
  });

  if (!device) {
    throw throwError(404, "Không tìm thấy device");
  }

  const node = await Node.findOne({
    _id: device.nodeId,
    isDelete: false
  });

  if (!node) {
    throw throwError(404, "Không tìm thấy node");
  }

  if (!node.gatewayId) {
    throw throwError(400, "Node chưa được gán vào gateway");
  }

  const gateway = await Project.findOne({
    _id: node.gatewayId,
    isDelete: false
  });

  if (!gateway) {
    throw throwError(404, "Không tìm thấy gateway");
  }

  publishDeviceCommand(gateway._id.toString(), {
    nodeNumber: node.number,
    pin: device.pin,
    turn: formData.turn
  });

  return {
    deviceId: device._id,
    nodeId: node._id,
    nodeNumber: node.number,
    gatewayId: gateway._id,
    pin: device.pin,
    turn: formData.turn
  };
};
