// Long-form writing, separate from case studies - opinions, ideas, and
// product thinking that doesn't belong to a single shipped project. Add new
// entries to this array; the list page and detail page both read from it,
// so nothing else needs to change.
export type Writing = {
  slug: string
  title: string
  subtitle: string
  /** Raw body in a tiny markdown subset: blank-line-separated paragraphs,
   *  "### Heading" lines, "- " bullet lines (consecutive ones group into one
   *  list), and **bold** inline spans. Parsed by renderWritingBody. */
  body: string
}

export const WRITINGS: Writing[] = [
  {
    slug: 'the-last-100-metres-problem',
    title: 'The Last 100 Metres Problem',
    subtitle: 'A case study on reducing delivery calls',
    body: `### What is happening today

Every delivery app today has invested heavily in location. There are maps, there are pin drops, there are detailed address forms asking for door number, floor, block, landmark, everything. Zomato has done this well. So have most other platforms. On paper, the address is complete.

### And still, the delivery partner calls.

This is the part worth sitting with. Why does the call keep happening even after all this effort has gone into the address itself? Because an address, however detailed, is a static thing. It doesn't know what today looks like at that building. It doesn't know that the customer is in the shower right now, or that their child has just been put to sleep after an hour of trying, or that they are elderly and don't hear the phone ring from the next room, they simply didn't see the call come in.

The customer may have already told the app, clearly, leave it outside the door, don't ring the bell. And yet the call still comes. Not because the delivery partner is being careless, but because the one thing that would actually help them, knowing exactly how to reach from the gate to the door, was never captured anywhere. So they do the only thing left to do. They call.

That is the actual problem. Not the address. The information that only ever existed inside a phone call, and disappeared the moment that call ended.

### How this could work

Think about a regular home. In a month, that one address might see anywhere close to 100 deliveries. Ten different delivery partners, maybe more, all reaching the same door.

The first delivery partner to ever visit that address almost always has to call. There is no way around it the first time. The conversation usually goes something like this. The customer says, come straight from the gate, there will be a few steps, next to the steps is a service lift, take that lift up to the seventh floor, once you're out on the seventh floor take a right, there's a small opening, then a short hallway, and the door is right there.

That entire conversation, right now, just evaporates once the call is over. The next delivery partner starts from zero, all over again.

This is where the idea comes in. What if that call didn't have to disappear?

An AI layer sits in the background of these calls and does two things:

- It transcribes the conversation and saves it against the customer's ID, so the information belongs to the address, not to any one delivery.
- It picks out the actual navigational instructions from that transcript and turns them into short, usable pointers, stripped of all the small talk and back and forth.

So instead of a full conversation, what gets saved for the next delivery partner looks something like this:

- Straight from the gate, steps on the right, service lift next to it
- Lift to the seventh floor, take a right after stepping out
- Small opening, short hallway, door is at the end

No paragraph to read through mid-delivery, no fluff. Just enough for someone who has never been to that building before to walk in and find the door without picking up the phone.

And if these pointers aren't enough for some reason, the delivery partner can still call. Nobody is taking that option away. The point isn't to remove the call completely. It is to make the call the exception instead of the rule.

### What happens the next time

The second delivery partner who comes to that same address doesn't call. They open the app, see the pointers already sitting there from the first delivery, and simply follow them. If anything has changed since then, a gate that's shut now, a lift that's under repair, that gets picked up the next time someone does call, and the pointers update themselves. Slowly, the address stops being just a pin on a map and starts becoming something closer to a small, living instruction sheet for reaching that door.

There is also a bigger opportunity sitting inside this, worth mentioning honestly. This isn't something that has to live only inside one delivery app. The same layer, transcription plus extraction plus storage against an address, could be built once and licensed out. Any platform doing last mile delivery, food, groceries, courier, e-commerce, has this exact same calling problem. This could just as easily be a B2B product on its own.

### In conclusion

India makes this both harder and more necessary at the same time. A delivery partner in one part of the country may not speak the same language as the customer on the other end of the call, and this happens far more often than people realise. The model behind this would need to be trained on native, bilingual speech so that it can transcribe correctly regardless of which language the customer is comfortable speaking in, and still hand the delivery partner something they can read and act on, even if they wouldn't have understood the original conversation at all.

To be clear, this will not solve the problem completely. There will always be some deliveries where a call is genuinely needed, a new construction, a one time event, a locked gate nobody expected. But for the very large number of repeat deliveries that happen to the same address again and again, this can bring the calls down significantly, and get the customer's order to their door the way they actually wanted it delivered in the first place.`,
  },
  {
    slug: 'phonepe-2-0-behind-the-redesign',
    title: 'PhonePe 2.0 - Behind the Redesign',
    subtitle: "An analysis of PhonePe's 2024 UI overhaul - bento layouts, muscle memory, and UPI design constraints.",
    body: `### Verdict

PhonePe's sudden UI revamp faced backlash as users, especially merchants, struggled with the abrupt change. Disrupting muscle memory risks frustration, making gradual updates preferable.

The old design, though cluttered, was familiar, while the new bento grid layout feels modern and structured. Multi-language support has improved, but dark mode needs accessibility refinements.

UPI apps share similar layouts due to NPCI guidelines and Jakob's Law, ensuring familiarity and fair competition. Users rarely switch apps due to habit and trust. PhonePe's redesign aligns with competitors but must balance innovation with user comfort.

### Users don't like change

When the PhonePe interface was changed overnight, the internet was flooded with comments. As a result, fewer people loved it, and most people didn't like it at all. As far as I'm aware, PhonePe has a sizeable market share, and the majority of its users are business owners, merchants, and store owners because it provides business and merchant apps.

Users dislike abrupt changes, which will impact their muscle memory, according to design principles. In the worst case scenario, they will quit using the app.

They started commenting on people's rant on X, they replied saying they wanted to improve:

- Navigation
- Modern look
- Accessibility
- Usability

Changes should be made gradually or significantly, in my opinion, as users may consider switching to other platforms or being convinced by their friends if they are made abruptly. A few user-submitted ideas based on the issue:

- Having a back button to Classic UI, this might enable bringing back the old UI completely
- Parent Mode, this helps people drive easy payment or the features they only need because they have very little technical knowledge

The techy, young, and gen-z people might get used to it in a week and only if they have any dependency like insurance and auto-pay, else they will be the first to change the platform. That's a separate use case, but the older generation people who use this will surely get hit and get confused even if they have changed the design overnight.

Every design will end up in the hands of consumers, and even if it has defects, if it solves a problem, they will continue to use it, which is how muscle memory is developed. Now suddenly you modify the interface and move stuff around, and it comes out as a problem.

### 1.0 - Before

For the majority of Indians, PhonePe is the preferred UPI app due to its well-organised list of requirements for everyday tasks. They had sections of sponsored apps, a large carousel for running advertising, and everything that brought them business was in the navigation bar.

![PhonePe's old list-based layout](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/PhonePe 2 0 - BTS/Group_481511.png)

A year back they changed the position of the QR from header to navigation bar, and it helped people click with ease and pay. This one interaction went viral and people applauded their efforts making it easier for users.

It had categorised rectangle boxes of:

- Recharge & Pay bills
- Loan
- Insurance

These do have sub categories, which again they listed upfront with icons. This was actually easy for people who could use exactly what they wanted to avail, yet found upfront.

The older design had a lot of Google ads and sponsored content, so it made the app more dense and cluttered. Most users say this is very clear and clutter-free because they adopted the interface, and someone using it for the first time will find it uneasy.

### After 2.0

This new revamp gives a lot of trust and clarity in my opinion. The first thing I notice is the elegance, which is more than the older design layout, it is clean and neat.

In their old design, we could see a lot of subcategories upfront, but here in the revamp the categories are clubbed into minimal cards, which is called bento grids. Bento box is a Japanese tradition of packing food into a box.

![PhonePe's new bento-grid layout](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/PhonePe 2 0 - BTS/Group_481512.png)

Depending on their priorities and the size that brings them the most revenue, they have maintained a variety of box sizes. They had distinct icons for each of the subcategories in the previous design, but now that they are claiming to redesign it for accessibility, they have included the features in the box itself.

This revamp also makes multi-language support easier. For example, we have GPay on the right and PhonePe on the left. If I change language it wraps text, but the PhonePe design is good for multiple languages and accessible for everyone. The information architecture of the cards is well structured, based on the features where they get good business. Now in each box they have a cool illustration which is subtle and elegant to explain what the card contains.

![PhonePe's bento cards with subtle illustrations](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/PhonePe 2 0 - BTS/Group_481513.png)

### PhonePe and design systems

PhonePe has a design system, and they have multiple apps like Pincode and Merchant apps, but there is inconsistency across those apps. Every app doesn't follow the same design system because they don't follow the same foundation. Every app has a connection to a generic design system, but the components they use in every app differ in purpose as well.

They recently rolled out dark mode to their new UI. It has rendered well, but in a few places they could work on accessibility, because UPI apps are for everybody.

The only way to have dark and light mode is using a design system, and they have been doing this very recently, and I hear they follow a design system and lean design-first.

### Designing for UPI apps

If you look at all the UPI apps, you'll see very similar UI. One of the reasons, from a pure design standpoint, is Jakob's Law, which states that people who use a niche category app serving almost the same service may expect the same experience anyway.

There's a catch, though. These apps are structured and built with almost identical UI as part of NPCI guidelines. NPCI's Volume Cap guideline, OC97, constrains transactions to around 30% across all apps. NPCI has analyzed the risks in the UPI ecosystem, and to address them and protect it, they've rolled out these guidelines, which is why so many UPI apps end up with almost the same layout.

![NPCI guideline constraints visualized across UPI apps](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/PhonePe 2 0 - BTS/Group_481510.png)

A lot of apps might have the same features and functionality just because of these NPCI guidelines they're meant to follow, and they do roll out brand guidelines for their logo so it doesn't confuse people. In verdict, designing for UPI apps needs to have a similar layout across all other apps, and they follow this. Beyond design, they also need features like UPI Lite, AutoPay, and others they already have.

Surprisingly, users who use UPI apps don't switch, because they'll find it difficult using unfamiliar layouts and features. As we use it daily we stick to a muscle memory, trust, and ease. Users find their current UPI app sufficient, and no alternative feels significantly better. So PhonePe has tried to build something similar to its competitors while keeping a simple layout, and that's how the design evolved.`,
  },
]

// ~200 words/min, rounded up so a 1-word blurb never reads "0 min read".
export function estimateReadTime(body: string): string {
  const words = body.trim().split(/\s+/).length
  const minutes = Math.max(1, Math.round(words / 200))
  return `${minutes} min read`
}
