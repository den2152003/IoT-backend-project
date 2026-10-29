import Node from "@/models/database/Node";
import Project from "@/models/database/Project";
import { publishNodeConfig } from "@/mqtt/publisher";
import { NodeFormData } from "@/shared-types/Form-data";
import { throwError } from "@/utils/ApiResponse";
import { getNextSequence } from "@/utils/getNextSequence";

export const registerDevice = async (formData: NodeFormData.IRegisterDevice) => {
  const existingNode = await Node.findOne({
    macId: formData.macId,
    isDelete: false
  }).populate("gatewayId", "number");

  if (existingNode) {
    return existingNode;
  }

  const number = await getNextSequence("node");

  const node = await Node.create({
    number,
    wifiName: formData.wifiName,
    macId: formData.macId
  });

  return node;
};

export const create = async (formData: NodeFormData.ICreateNode) => {
  const gateway = await Project.findOne({
    _id: formData.gatewayId,
    isDelete: false
  });

  if (!gateway) {
    throw throwError(404, "Không tìm thấy gateway");
  }

  const number = await getNextSequence("node");

  const node = await Node.create({
    ...formData,
    gatewayId: gateway._id,
    number
  });

  return node;
};

export const getList = async ({
  page = 1,
  limit = 20,
  search,
  gatewayId
}: NodeFormData.IGetList) => {
  const filter: Record<string, unknown> = {
    isDelete: false
  };

  if (search?.trim()) {
    filter.name = {
      $regex: search.trim(),
      $options: "i"
    };
  }

  if (gatewayId) {
    filter.gatewayId = gatewayId;
  }

  const [rows, count] = await Promise.all([
    Node.find(filter)
      .populate("gatewayId", "name number wifiName macId")
      .sort({ number: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),

    Node.countDocuments(filter)
  ]);

  return {
    rows,
    count,
    page,
    limit
  };
};

export const getDetail = async (id: string) => {
  const node = await Node.findOne({
    _id: id,
    isDelete: false
  }).populate("gatewayId", "name number wifiName macId");

  if (!node) {
    throw throwError(404, "Không tìm thấy node");
  }

  return node;
};

export const update = async (id: string, formData: NodeFormData.IUpdateNode) => {
  const node = await Node.findOne({
    _id: id,
    isDelete: false
  });

  if (!node) {
    throw throwError(404, "Không tìm thấy node");
  }

  let gatewayNumber: number | null = null;

  if (formData.name !== undefined) {
    node.name = formData.name;
  }

  if (formData.description !== undefined) {
    node.description = formData.description;
  }

  if (formData.macId !== undefined) {
    node.macId = formData.macId;
  }

  if (formData.wifiName !== undefined) {
    node.wifiName = formData.wifiName;
  }

  if (formData.gatewayId !== undefined) {
    const gateway = await Project.findOne({
      _id: formData.gatewayId,
      isDelete: false
    });

    if (!gateway) {
      throw throwError(404, "Không tìm thấy gateway");
    }

    node.gatewayId = gateway._id;
    gatewayNumber = gateway.number;
  } else if (node.gatewayId) {
    const gateway = await Project.findOne({
      _id: node.gatewayId,
      isDelete: false
    });

    gatewayNumber = gateway?.number ?? null;
  }

  await node.save();

  publishNodeConfig(node.macId, node.number, gatewayNumber);

  return node;
};

export const remove = async (id: string) => {
  const node = await Node.findOne({
    _id: id,
    isDelete: false
  });

  if (!node) {
    throw throwError(404, "Không tìm thấy node");
  }

  node.isDelete = true;

  await node.save();

  return {
    id: node._id.toString()
  };
};

export const selectionByWifiName = async (wifiName: string) => {
  return await Node.find({ wifiName, isDelete: false, gatewayId: { $exists: false } })
    .sort({ createdAt: -1 })
    .lean();
};
