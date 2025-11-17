"use client"

import { de } from "date-fns/locale/de"
import * as React from "react"

import { Calendar } from "@/components/ui/calendar"


export default function OrganizationCalendar() {
    const [date, setDate] = React.useState<Date | undefined>(new Date())

    return (
        <Calendar
            locale={de}
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border shadow-sm"
            captionLayout="dropdown"
        />
    )
}
