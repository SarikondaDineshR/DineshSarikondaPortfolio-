import React from 'react'

const TECH_ITEMS = [
  '.NET 8', 'C# 12', 'ASP.NET Core', 'Azure', 'AWS', 'Google Cloud',
  'Kubernetes', 'Docker', 'React', 'Next.js', 'TypeScript', 'Terraform',
  'Microservices', 'gRPC', 'SignalR', 'Azure OpenAI', 'ML.NET', 'Kafka',
  'CosmosDB', 'Redis', 'GraphQL', 'Clean Architecture', 'CQRS', 'Event Sourcing',
  'AKS', 'ECS', 'GKE', 'Semantic Kernel', 'Blazor', 'Entity Framework',
]

export default function TechTicker() {
  // Duplicate for seamless loop
  const items = [...TECH_ITEMS, ...TECH_ITEMS]

  return (
    <div
      className="ticker-wrap py-3 border-t border-b border-white/[0.04] bg-bg/40 backdrop-blur-sm"
      style={{ zIndex: 20, position: 'relative' }}
    >
      <div className="ticker-track">
        {items.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 mx-4 text-[11px] font-medium tracking-widest text-white/20 select-none"
          >
            {item}
            {i < items.length - 1 && (
              <span className="text-white/10">·</span>
            )}
          </span>
        ))}
      </div>
    </div>
  )
}
