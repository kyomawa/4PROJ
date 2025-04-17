"use server";

// =======================================================================================

import { loginSchemaFormData, registerSchemaFormData } from "./schema";
import { createSession } from "@/lib/session";
import { revalidateTag } from "next/cache";

// =======================================================================================

export const register = async (formData: FormData): Promise<ApiResponse<null>> => {};

// =======================================================================================

export const login = async (formData: FormData): Promise<ApiResponse<null>> => {};

// =======================================================================================
