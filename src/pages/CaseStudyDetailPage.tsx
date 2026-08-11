import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import caseStudies from '../data/caseStudies.json'
import { CASE_FOLDERS, renderContent, stripPersonalIntros, AI_SUMMARIES, AI_SUMMARY_LABELS } from './CaseStudiesPage'
import CaseStudyHero from '../components/CaseStudyHero'
import BackButton from '../components/BackButton'
import BackToTopButton from '../components/BackToTopButton'
import { FONTS } from '../theme'

// Real, individually-routable page for a general (non-Kynhood) case study -
// replaces the old right-side sliding panel over the folder gallery with a
// full page, same top-fold hero pattern as the Kynhood case studies.
const LOCKED_IDS = new Set([
  'competitive-audit---real-estate-sites',
  'kynhood---ux-&-ai',
  'phonepe-2-0---bts',
  'foundit---ux-case-study',
  'recruit-crm---ux-enhancement-1---abusyeed',
])

export default function CaseStudyDetailPage() {
  const { caseId } = useParams<{ caseId: string }>()
  const navigate = useNavigate()
  const study = caseStudies.find((s) => s.id === caseId)
  const folder = CASE_FOLDERS.find((f) => f.id === caseId)

  if (!study || !folder) {
    navigate('/casestudies')
    return null
  }

  const isTopPick = LOCKED_IDS.has(study.id)

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: '#ffffff' }}>
      <CaseStudyHero
        client="Independent case study"
        period={folder.readTime}
        category={isTopPick ? 'Top pick' : 'Case study'}
        title={folder.title}
        subtitle={AI_SUMMARIES[study.id]?.[0] ?? ''}
        mockupImage={folder.image}
        stats={[]}
        onBack={() => navigate(-1)}
      />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: 'var(--space-16) var(--space-8) var(--space-24)' }}>
        {AI_SUMMARIES[study.id] && (
          <div style={{
            marginBottom: 40,
            borderRadius: 12,
            border: '1px solid #d7f0e6',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #f2faf6 0%, #eefaf7 100%)',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 16px',
              borderBottom: '1px solid #d7f0e6',
              background: 'rgba(7,122,75,0.08)',
            }}>
              <Icon icon="solar:stars-minimalistic-outline" width={15} color="#077a4b" />
              <span style={{ fontFamily: FONTS.body, fontSize: '0.7rem', fontWeight: 700, color: '#077a4b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                AI Summary
              </span>
              <span style={{
                marginLeft: 'auto', fontSize: '0.6rem', color: '#077a4b', opacity: 0.6,
                background: '#d7f0e6', borderRadius: 4, padding: '2px 7px', fontWeight: 600,
              }}>
                Generated
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '76px 1fr' }}>
              {AI_SUMMARIES[study.id].map((line, i) => {
                const isLast = i === AI_SUMMARIES[study.id].length - 1
                return (
                  <>
                    <div key={`label-${i}`} style={{
                      padding: '10px 12px 10px 16px',
                      borderBottom: !isLast ? '1px solid rgba(7,122,75,0.12)' : 'none',
                      borderRight: '1px solid rgba(7,122,75,0.18)',
                      display: 'flex', alignItems: 'center',
                    }}>
                      <span style={{
                        fontFamily: FONTS.body, fontSize: '0.55rem', fontWeight: 800, color: '#077a4b',
                        textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.5,
                      }}>
                        {(study.id === 'stimuler---ux-enhancement' || study.id === 'competitive-audit---real-estate-sites') && i === 0
                          ? 'Goal'
                          : (AI_SUMMARY_LABELS[i] ?? String(i + 1).padStart(2, '0'))}
                      </span>
                    </div>
                    <div key={`val-${i}`} style={{
                      padding: '10px 16px',
                      borderBottom: !isLast ? '1px solid rgba(7,122,75,0.12)' : 'none',
                    }}>
                      <p style={{ margin: 0, fontFamily: FONTS.body, fontSize: '0.85rem', color: '#0f172a', lineHeight: 1.65 }}>{line}</p>
                    </div>
                  </>
                )
              })}
            </div>
          </div>
        )}
        {renderContent(stripPersonalIntros(study.text), study.id)}

        {/* See more works - same closer pattern as the Kynhood case studies */}
        <div style={{ marginTop: 'var(--space-20)', paddingTop: 'var(--space-16)', borderTop: '1px solid var(--color-border)' }}>
          <h3 style={{ margin: '0 0 var(--space-6)', fontFamily: FONTS.display, fontStyle: 'italic', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            See more works
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {CASE_FOLDERS.filter((f) => f.id !== study.id).slice(0, 2).map((f) => (
              <button
                key={f.id}
                onClick={() => navigate(`/casestudies/${f.id}`)}
                style={{ textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '10px' }}
              >
                <div style={{ width: '100%', aspectRatio: '16/8', borderRadius: 12, overflow: 'hidden', background: 'var(--color-bg-secondary)' }}>
                  <img src={f.image} alt={f.title} style={{ width: '100%', height: '100%', objectFit: f.id === 'medrep---assignment' ? 'contain' : 'cover', display: 'block' }} />
                </div>
                <span style={{ fontFamily: FONTS.body, fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {f.tag}
                </span>
                <span style={{ fontFamily: FONTS.display, fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{f.title}</span>
                {AI_SUMMARIES[f.id]?.[0] && (
                  <span style={{ fontFamily: FONTS.body, fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                    {AI_SUMMARIES[f.id][0]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <BackButton />
      <BackToTopButton dark={false} />
    </div>
  )
}
