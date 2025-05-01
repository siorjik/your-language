'use client'

import { Fragment } from 'react'

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
        {data.links.map((item, idx) => {
          return (
            <Fragment key={idx}>
              <BreadcrumbItem>
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </Fragment>
          )
        })}
        <BreadcrumbItem>
          <BreadcrumbPage>{data.current}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
