import Node from "@/models/database/Node";
import SensorData from "@/models/database/SensorData";
import { publishRealtimeSensorData } from "@/mqtt/publisher";
import { SensorDataFormData } from "@/shared-types/Form-data";
import { throwError } from "@/utils/ApiResponse";
import mongoose from "mongoose";

export const createByNodeMacId = async (
  macId: string,
  payload: SensorDataFormData.ISensorDataPayload
) => {
  const node = await Node.findOne({
    macId,
    isDelete: false
  });

  if (!node) {
    return throwError(404, "Không tìm thấy node");
  }

  const sensorData = await SensorData.create({
    nodeId: node._id,
    temperature: payload.temperature,
    air: payload.air,
    humidity: payload.humidity,
    light: payload.light
  });

  publishRealtimeSensorData(macId, {
    temperature: sensorData.temperature,
    air: sensorData.air,
    humidity: sensorData.humidity,
    light: sensorData.light
  });
  return sensorData;
};

export const getList = async ({ page = 1, limit = 20, nodeId }: SensorDataFormData.IGetList) => {
  const filter: Record<string, unknown> = {};

  if (nodeId) {
    const node = await Node.findOne({
      _id: nodeId,
      isDelete: false
    });

    if (!node) {
      throw throwError(404, "Không tìm thấy node");
    }

    filter.nodeId = node._id;
  }

  const skip = (page - 1) * limit;

  const [rows, count] = await Promise.all([
    SensorData.find(filter)
      .populate("nodeId", "name number macId wifiName gatewayId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    SensorData.countDocuments(filter)
  ]);

  return {
    rows,
    count
  };
};

export const getStatistics = async ({ nodeId, type }: SensorDataFormData.IGetStatistics) => {
  const node = await Node.findOne({
    _id: nodeId,
    isDelete: false
  });

  if (!node) {
    throw throwError(404, "Không tìm thấy node");
  }

  const now = new Date();

  const from = new Date(now);

  if (type === "day") {
    from.setHours(0, 0, 0, 0);
  }

  if (type === "week") {
    from.setDate(from.getDate() - 6);
    from.setHours(0, 0, 0, 0);
  }

  if (type === "month") {
    from.setDate(from.getDate() - 29);
    from.setHours(0, 0, 0, 0);
  }

  const groupFormat = type === "day" ? "%H:00" : "%d/%m";

  const rows = await SensorData.aggregate([
    {
      $match: {
        nodeId: new mongoose.Types.ObjectId(nodeId),
        createdAt: {
          $gte: from,
          $lte: now
        }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: groupFormat,
            date: "$createdAt",
            timezone: "Asia/Ho_Chi_Minh"
          }
        },
        temperature: {
          $avg: "$temperature"
        },
        air: {
          $avg: "$air"
        },
        humidity: {
          $avg: "$humidity"
        },
        light: {
          $avg: "$light"
        }
      }
    },
    {
      $sort: {
        _id: 1
      }
    },
    {
      $project: {
        _id: 0,
        time: "$_id",
        temperature: 1,
        air: 1,
        humidity: 1,
        light: 1
      }
    }
  ]);

  return {
    node: {
      _id: node._id,
      name: node.name,
      number: node.number,
      macId: node.macId
    },
    type,
    from,
    to: now,
    rows
  };
};
