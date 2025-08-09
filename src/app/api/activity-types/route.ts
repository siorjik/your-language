import { NextRequest, NextResponse } from 'next/server'

import getServerSessionToken from '@/helpers/getServerSessionToken'
import { Err, ErrObj } from '@/types/errTypes'
import { ActivityType } from '@prisma/client'
import { getActivityTypes } from '@/actions/activityType'

export async function GET(req: NextRequest): Promise<NextResponse<{ activityTypes: ActivityType[]; error: null } | Err>> {
  try {
    const activityTypes = await getActivityTypes()

    if (activityTypes.error) throw activityTypes.error
    else return NextResponse.json(activityTypes)
  } catch (error) {
    const err = error as ErrObj | Error

    return NextResponse.json({ error: { message: err.message, statusCode: 400 } }, { status: 400 })
  }
}
