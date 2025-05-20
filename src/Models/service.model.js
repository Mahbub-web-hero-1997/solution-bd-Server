import { Schema } from "mongoose";

const serviceSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    extraService: {
      type: String,
      default: "There has no extra services",
    },
  },

  {
    timestamps: true,
  }
);

export default serviceSchema;
