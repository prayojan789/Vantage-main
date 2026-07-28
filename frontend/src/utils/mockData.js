export const MOCK_SOURCES = {
  sources: ['The Kathmandu Post','Republica','OnlineKhabar English','The Himalayan Times','My Republica','Setopati English','Nepal Monitor'],
}

export const MOCK_EVENTS = {
  total: 6,
  events: [
    { id:'evt_001', title:'Cabinet reshuffle negotiations intensify amid coalition pressure', date:'2025-06-07T10:30:00Z', article_count:3, sources:['The Kathmandu Post','Republica','OnlineKhabar English'], entities:['KP Oli','UML','NC'], dominant_sentiment:'negative', similarity_score:0.93 },
    { id:'evt_002', title:'RSP and Balen Shah distance themselves from Establishment coalition', date:'2025-06-07T08:00:00Z', article_count:2, sources:['The Himalayan Times','Republica'], entities:['RSP','Balen Shah','Rabi Lamichhane'], dominant_sentiment:'positive', similarity_score:0.87 },
    { id:'evt_003', title:'Terai border dispute: government issues formal response to India', date:'2025-06-06T15:45:00Z', article_count:4, sources:['The Kathmandu Post','OnlineKhabar English','Republica','My Republica'], entities:['PM Dahal','Home Ministry'], dominant_sentiment:'neutral', similarity_score:0.89 },
    { id:'evt_004', title:'UML party congress concludes: KP Oli re-elected chair unanimously', date:'2025-06-06T11:00:00Z', article_count:3, sources:['The Kathmandu Post','Republica','Setopati English'], entities:['KP Oli','UML'], dominant_sentiment:'negative', similarity_score:0.91 },
    { id:'evt_005', title:"Nepal's GDP growth forecast revised upward by World Bank to 5.1%", date:'2025-06-05T09:00:00Z', article_count:2, sources:['My Republica','The Himalayan Times'], entities:['Finance Ministry','NRB'], dominant_sentiment:'positive', similarity_score:0.85 },
    { id:'evt_006', title:'Supreme Court ruling on electoral threshold sparks constitutional debate', date:'2025-06-04T14:00:00Z', article_count:3, sources:['The Kathmandu Post','Nepal Monitor','Setopati English'], entities:['Supreme Court','Election Commission','RSP'], dominant_sentiment:'neutral', similarity_score:0.88 },
  ],
}

export const MOCK_EVENT_DETAIL = {
  id:'evt_001', title:'Cabinet reshuffle negotiations intensify amid coalition pressure', date:'2025-06-07T10:30:00Z',
  articles:[
    {
      id:'art_001', source:'The Kathmandu Post',
      headline:'PM faces mounting pressure as coalition partners demand cabinet reshuffle',
      url:'https://kathmandupost.com', published_at:'2025-06-07T09:15:00Z',
      sentiment:'negative', sentiment_score: 0.82,
      entities:[
        { name:'KP Oli', sentiment:'negative', score:0.88 },
        { name:'UML',    sentiment:'neutral',  score:0.51 },
        { name:'NC',     sentiment:'positive', score:0.62 },
      ],
      summary:'Frames the reshuffle as a full-blown crisis. Highlights coalition fractures and UML opposition demands. The tone is sharply critical of current leadership and questions PM Dahal\'s ability to hold the coalition together.',
    },
    {
      id:'art_002', source:'Republica',
      headline:'Cabinet transition seen as routine democratic process, say analysts',
      url:'https://myrepublica.nagariknetwork.com', published_at:'2025-06-07T10:00:00Z',
      sentiment:'neutral', sentiment_score:0.54,
      entities:[
        { name:'KP Oli', sentiment:'neutral',  score:0.49 },
        { name:'NC',     sentiment:'positive', score:0.71 },
      ],
      summary:'A measured framing quoting political analysts who see the reshuffle as normal coalition mechanics rather than instability. Republica positions NC as a stabilizing force throughout the piece.',
    },
    {
      id:'art_003', source:'OnlineKhabar English',
      headline:'RSP distances from reshuffle talks; Balen hails independent stance over party politics',
      url:'https://english.onlinekhabar.com', published_at:'2025-06-07T11:10:00Z',
      sentiment:'positive', sentiment_score:0.69,
      entities:[
        { name:'RSP',        sentiment:'positive', score:0.81 },
        { name:'Balen Shah', sentiment:'positive', score:0.77 },
        { name:'KP Oli',     sentiment:'negative', score:0.74 },
      ],
      summary:'Pivots away from the reshuffle narrative entirely to showcase RSP and Balen as reformist alternatives. Positions them positively in contrast to Establishment parties mired in coalition infighting.',
    },
  ],
}

export const MOCK_BIAS = {
  top_entities:['KP Oli','RSP','NC','Balen Shah','UML','PM Dahal'],
  media_houses:[
    {
      name:'The Kathmandu Post', positive:28, negative:52, neutral:40,
      trend:[{date:'May 10',score:-0.20},{date:'May 15',score:-0.35},{date:'May 20',score:-0.28},{date:'May 25',score:-0.45},{date:'May 30',score:-0.38},{date:'Jun 04',score:-0.52},{date:'Jun 07',score:-0.48}],
    },
    {
      name:'Republica', positive:55, negative:22, neutral:43,
      trend:[{date:'May 10',score:0.30},{date:'May 15',score:0.22},{date:'May 20',score:0.40},{date:'May 25',score:0.35},{date:'May 30',score:0.42},{date:'Jun 04',score:0.38},{date:'Jun 07',score:0.45}],
    },
    {
      name:'OnlineKhabar English', positive:44, negative:30, neutral:36,
      trend:[{date:'May 10',score:0.10},{date:'May 15',score:0.18},{date:'May 20',score:0.05},{date:'May 25',score:0.22},{date:'May 30',score:0.30},{date:'Jun 04',score:0.15},{date:'Jun 07',score:0.28}],
    },
    {
      name:'The Himalayan Times', positive:38, negative:35, neutral:47,
      trend:[{date:'May 10',score:0.05},{date:'May 15',score:-0.08},{date:'May 20',score:0.12},{date:'May 25',score:-0.05},{date:'May 30',score:0.08},{date:'Jun 04',score:0.02},{date:'Jun 07',score:0.10}],
    },
  ],
}

export const MOCK_ANALYZE = (text) => {
  const lower = text.toLowerCase()
  const entities = []
  if (lower.includes('oli') || lower.includes('uml'))
    entities.push({ name:'KP Oli', sentiment:'negative', score:0.84, context:'…critical framing surrounds KP Oli throughout the passage…' })
  if (lower.includes('rsp') || lower.includes('rabi') || lower.includes('lamichhane'))
    entities.push({ name:'RSP / Rabi Lamichhane', sentiment:'positive', score:0.76, context:'…RSP positioned as a constructive alternative force…' })
  if (lower.includes('balen'))
    entities.push({ name:'Balen Shah', sentiment:'positive', score:0.81, context:'…Balen praised for independent governance stance…' })
  if (lower.includes('dahal') || lower.includes(' pm '))
    entities.push({ name:'PM Dahal', sentiment:'neutral', score:0.52, context:'…PM Dahal mentioned without strong positive or negative framing…' })
  if (lower.includes('nc') || lower.includes('congress'))
    entities.push({ name:'Nepali Congress', sentiment:'neutral', score:0.48, context:'…NC referenced in procedural context…' })
  if (entities.length === 0)
    entities.push({ name:'Unidentified Entity', sentiment:'neutral', score:0.50, context: text.slice(0, 90) + '…' })
  const neg = entities.filter(e => e.sentiment === 'negative').length
  const pos = entities.filter(e => e.sentiment === 'positive').length
  return { entities, overall_sentiment: neg > pos ? 'negative' : pos > neg ? 'positive' : 'neutral', processing_ms: Math.floor(Math.random()*300+250) }
}
