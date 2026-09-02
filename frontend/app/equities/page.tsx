'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Icon from '../components/ui/Icon'
import { ShimmerCard, ShimmerRow } from '../components/ui/Shimmer'

interface SectorData {
  name: string
  price: number
  change: number
  change_pct: string | number
  exchange: string
}

interface SectorsResponse {
  sectors: Record<string, SectorData>
}

interface Company {
  symbol: string
  name: string
  sector: string
  price: number
  change: number
  change_pct: number
  marketCap: number
}

export default function EquitiesOverviewPage() {
  const [sectors, setSectors] = useState<Record<string, SectorData> | null>(null)
  const [companies, setCompanies] = useState<Company[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || ''
        const [sectorsRes, companiesRes] = await Promise.all([
          fetch(`${baseUrl}/api/market/sectors`),
          fetch(`${baseUrl}/api/company/list`)
        ])

        if (sectorsRes.ok) {
          const sData: SectorsResponse = await sectorsRes.json()
          setSectors(sData.sectors)
        }
        if (companiesRes.ok) {
          const cData: Company[] = await companiesRes.json()
          setCompanies(cData)
        }
      } catch (error) {
        console.error('Error fetching equities data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  const renderSectorGrid = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {Array.from({ length: 6 }).map((_, i) => (
            <ShimmerCard key={i} />
          ))}
        </div>
      )
    }

    if (!sectors) return <div className="text-on-surface-variant">Data unavailable</div>

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {Object.entries(sectors).map(([key, sector]) => {
          const changePct = Number(sector.change_pct)
          const isPositive = changePct >= 0
          return (
            <div
              key={key}
              className="bg-surface-container-high rounded-xl p-6 border border-outline-variant transition-transform hover:scale-[1.02] cursor-default flex flex-col justify-between h-full"
            >
              <div className="text-on-surface-variant text-sm font-medium mb-4">{sector.name}</div>
              <div className="flex items-end justify-between">
                <div className="font-mono-data text-2xl text-on-surface">
                  {sector.price != null ? sector.price.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : 'N/A'}
                </div>
                {sector.change_pct != null && (
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-mono-data flex items-center gap-1 ${
                      isPositive ? 'bg-positive/10 text-positive' : 'bg-negative/10 text-negative'
                    }`}
                  >
                    <Icon name={isPositive ? 'trending_up' : 'trending_down'} className="w-3 h-3" />
                    {isPositive ? '+' : ''}{changePct.toFixed(2)}%
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderMovers = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter mt-8">
          <div className="flex flex-col gap-unit">
            {Array.from({ length: 5 }).map((_, i) => <ShimmerRow key={`g-${i}`} />)}
          </div>
          <div className="flex flex-col gap-unit">
            {Array.from({ length: 5 }).map((_, i) => <ShimmerRow key={`l-${i}`} />)}
          </div>
        </div>
      )
    }

    if (!companies) return null

    const sortedCompanies = [...companies].sort((a, b) => b.change_pct - a.change_pct)
    const gainers = sortedCompanies.slice(0, 5)
    const losers = [...companies].sort((a, b) => a.change_pct - b.change_pct).slice(0, 5)

    const renderList = (list: Company[], isGainer: boolean) => (
      <div className="flex flex-col gap-2">
        {list.map(c => (
          <Link
            key={c.symbol}
            href={`/equities/companies/${c.symbol}`}
            className="flex items-center justify-between p-4 bg-surface-container rounded-xl border border-outline-variant hover:border-outline transition-colors"
          >
            <div className="flex flex-col gap-1">
              <span className="text-on-surface font-medium truncate max-w-[200px] sm:max-w-[300px]">
                {c.name}
              </span>
              <span className="text-xs text-on-surface-variant font-mono-data bg-surface py-0.5 px-2 rounded-full w-fit">
                {c.symbol}
              </span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="font-mono-data text-on-surface">
                {c.price != null ? c.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'N/A'}
              </span>
              <span
                className={`text-xs font-mono-data px-2 py-0.5 rounded-full flex items-center ${
                  isGainer ? 'text-positive bg-positive/10' : 'text-negative bg-negative/10'
                }`}
              >
                {c.change_pct > 0 ? '+' : ''}{c.change_pct.toFixed(2)}%
              </span>
            </div>
          </Link>
        ))}
      </div>
    )

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter mt-6">
        <div>
          <h3 className="text-on-surface text-lg font-medium mb-4 flex items-center gap-2">
            <Icon name="keyboard_double_arrow_up" className="text-positive" />
            Top Gainers
          </h3>
          {renderList(gainers, true)}
        </div>
        <div>
          <h3 className="text-on-surface text-lg font-medium mb-4 flex items-center gap-2">
            <Icon name="keyboard_double_arrow_down" className="text-negative" />
            Top Losers
          </h3>
          {renderList(losers, false)}
        </div>
      </div>
    )
  }

  return (
    <div className="p-margin flex flex-col gap-margin max-w-7xl mx-auto">
      {/* HEADER */}
      <header className="flex flex-col gap-2">
        <h1 className="font-serif font-bold text-4xl text-on-surface">Equities</h1>
        <p className="text-on-surface-variant text-lg">
          Indian equity markets — sectoral indices and the Nifty 50 universe
        </p>
      </header>

      {/* SECTOR HEATMAP */}
      <section>
        <h2 className="text-on-surface font-serif text-2xl font-semibold mb-6 flex items-center gap-2">
          <Icon name="monitoring" className="text-primary" />
          Sectoral Indices
        </h2>
        {renderSectorGrid()}
      </section>

      {/* TOP MOVERS */}
      <section>
        <h2 className="text-on-surface font-serif text-2xl font-semibold mb-2">Today&apos;s Movers</h2>
        {renderMovers()}
      </section>

      {/* CTA BANNER */}
      <section className="mt-4">
        <Link
          href="/equities/companies"
          className="block w-full bg-primary/10 border border-primary/30 rounded-xl p-6 transition-colors hover:bg-primary/20 flex items-center justify-between group"
        >
          <div>
            <h3 className="text-primary font-bold text-xl mb-1 group-hover:underline">Explore the Screener Engine</h3>
            <p className="text-primary-dim text-sm">
              Filter and analyze the Nifty 500 universe with advanced metrics and technical indicators.
            </p>
          </div>
          <Icon name="arrow_forward" className="text-primary w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>
    </div>
  )
}
