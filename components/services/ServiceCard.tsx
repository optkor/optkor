"use client"

import { motion } from "framer-motion"
import type { Service } from "@/lib/supabase/types"

export function ServiceCard({ service, index = 0 }: { service: Service; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.36) }}
      className="group border-t border-line py-8 transition-colors hover:border-accent/40"
    >
      <div className="flex items-baseline justify-between gap-6">
        <h3 className="font-display text-2xl text-paper transition-colors group-hover:text-accent md:text-3xl">
          {service.title}
        </h3>
        <span className="hidden font-display text-sm text-muted md:block">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      {service.short_description && (
        <p className="mt-3 max-w-2xl text-sm text-muted">{service.short_description}</p>
      )}
    </motion.div>
  )
}
