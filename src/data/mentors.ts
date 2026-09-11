// Shared with MentorsPage.tsx (renders the grid) and seoConfig.ts (builds the
// /mentors page's structured data) - one list instead of two copies drifting
// apart. `image` left empty renders an initials avatar instead of a broken
// <img>. `platform` picks the link icon; `url` is where the name/photo
// clicks through to.
export type Mentor = {
  name: string
  note: string
  platform: 'linkedin' | 'youtube'
  url: string
  image?: string
}

// `note` is their own LinkedIn headline/role, not a personal story - the
// one place for "why they're on this list" is the page subtitle, not
// repeated on every card.
export const MENTORS: Mentor[] = [
  { name: 'Anil Reddy', note: 'Founder of Lollypop Design Studio and the How UX Works YouTube channel, now building Happy Pet Care.', platform: 'linkedin', url: 'https://www.linkedin.com/in/anildesign/', image: '/gallery/mentors/anil-reddy.jpg' },
  { name: 'Saptarshi Prakash', note: 'Director of Design at Swiggy, speaker and content creator on design.', platform: 'linkedin', url: 'https://www.linkedin.com/in/saptarshipr/', image: '/gallery/mentors/saptarshi-prakash.jpg' },
  { name: 'Vishnu S', note: 'Product and UX designer at Venzo Technologies.', platform: 'linkedin', url: 'https://www.linkedin.com/in/vishnu-s-330881189/', image: '/gallery/mentors/vishnu-s.jpg' },
  { name: 'Chethan KVS', note: 'AI-powered design workflows and Figma-to-code, via Don’t Be an NPC.', platform: 'linkedin', url: 'https://www.linkedin.com/in/chethankvs/', image: '/gallery/mentors/chethan-kvs.jpg' },
  { name: 'Vijay Verma', note: 'UI/UX teardowns and design breakdowns, now building his own games.', platform: 'linkedin', url: 'https://www.linkedin.com/in/realvjy/', image: '/gallery/mentors/vijay-verma.jpg' },
  { name: 'Anik Jain', note: 'Creative Director at DZ!NR, logo and brand identity work, TEDx speaker.', platform: 'linkedin', url: 'https://www.linkedin.com/in/anikjaindesign/', image: '/gallery/mentors/anik-jain.jpg' },
  { name: 'Anudeep Ayyagari', note: 'Runs UX Gym, UX breakdowns and career advice for designers.', platform: 'linkedin', url: 'https://www.linkedin.com/in/anudeep108/', image: '/gallery/mentors/anudeep-ayyagari.jpg' },
  { name: 'Rajat Patel', note: 'Design work at Molades.', platform: 'linkedin', url: 'https://www.linkedin.com/in/rajatpatel2113/', image: '/gallery/mentors/rajat-patel.jpg' },
  { name: 'Abhinav Chhikara', note: 'Memetic Design, brand and meme-driven design thinking.', platform: 'linkedin', url: 'https://www.linkedin.com/in/abnux/', image: '/gallery/mentors/abhinav-chhikara.jpg' },
  { name: 'RK', note: 'Design work I follow.', platform: 'linkedin', url: 'https://www.linkedin.com/in/rkdotxyz/', image: '/gallery/mentors/rk.jpg' },
  { name: 'Harsh Raj Gond', note: 'Senior Product Designer, 5+ years designing AI-integrated product experiences.', platform: 'linkedin', url: 'https://www.linkedin.com/in/harsh-raj-gond-a2670b135/', image: '/gallery/mentors/harsh-raj-gond.jpg' },
  { name: 'Rashmi Asokan', note: 'Senior Product Designer at SuperOps, formerly a fractional designer at Kynhood.', platform: 'linkedin', url: 'https://www.linkedin.com/in/rashmi-asokan/', image: '/gallery/mentors/rashmi-asokan.jpg' },
  { name: 'Sushrut Mangeshikar', note: 'Digital product designer at Rimigo, based in Bengaluru.', platform: 'linkedin', url: 'https://www.linkedin.com/in/sushrutm/', image: '/gallery/mentors/sushrut-mangeshikar.jpg' },
  { name: 'Mohit Yagnik', note: 'UX designer and digital strategist.', platform: 'linkedin', url: 'https://www.linkedin.com/in/mohityagnik/', image: '/gallery/mentors/mohit.jpg' },
]
