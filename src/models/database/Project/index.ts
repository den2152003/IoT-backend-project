import mongoose from "mongoose";
import ProjectSchema, { type IProject } from "./ProjectSchema";

const Project = mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
