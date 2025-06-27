'use client'

import { Fragment } from 'react'
import { House } from 'lucide-react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export default function BreadcrumbWrap({ data }: { data: { links: { href: string; label: string }[]; current: string } }) {
  return (
    <Breadcrumb className="mb-8">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">
            <House size={15} />
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {data.links.map((item, idx) => {
          return (
            <Fragment key={idx}>
              <BreadcrumbItem>
                <BreadcrumbLink className="max-w-40 truncate" href={item.href}>
                  {item.label}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </Fragment>
          )
        })}
        <BreadcrumbItem>
          <BreadcrumbPage className="max-w-40 truncate font-semibold">{data.current}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
