import { NextResponse } from 'next/server';

export function successResponse(data: any, message: string = 'Success', status: number = 200) {
  return NextResponse.json({
    success: true,
    message,
    data,
  }, { status });
}

export function errorResponse(message: string = 'Internal Server Error', status: number = 500, errors?: any) {
  return NextResponse.json({
    success: false,
    message,
    errors,
  }, { status });
}
