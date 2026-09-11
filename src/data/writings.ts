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
    slug: 'school-bus-tracker-observations',
    title: 'School Bus Tracker - Observations',
    subtitle: 'A take-home audit of a school bus tracking prototype, covering what breaks for parents and drivers, and a revamped set of screens for the top issues.',
    body: `[School Bus Tracker - Figma design file](https://www.figma.com/design/BWvUjSyB7N2NBR0rm2lYMZ/Marek-Systems---Task?node-id=0-1&t=yrqDSjk92wBSUW32-1)

I've actually made this particular assignment using Figma and the whole document I've written is completely by Wispr Flow. I've actually spoken with my mic and I've actually pasted here and I've not used any AI to generate any screens. Also have used a few text styles and color styles in Figma as per what you have shared. I am not using anything more structured because I have very less time to do so. I don't want to actually consume more time on there so rather than actually focus on giving more rationale on design decisions.

### Key Problems (part 1)

I read the assignment and it is about school bus tracking. I identified some of the key problems from the assignment and it is a very close-ended problem. I have thought of a lot of things there and from that I have picked a few problems to solve and I will be focusing.

- Parents have to track their children through the journey or maybe checking randomly.
- It is very hard to use because maybe they are commuting to work or if they are very busy with their work or in urgent they can use this.
- There might be a problem when the time zone for their children is different. Maybe if there are two children studying in school, they can have a different time based on their grade.
- They will be primarily looking to know if there is any delay in the road or if it will take time or something like that.

The whole web app didn't actually match as per problem. I have actually gone through the user flow completely and I felt there is scope for improvement that I have actually written below this document.

### Assumptions and Constraints

I have actually assumed this particular thing: that the school has initiated this app and the users and their children who are there in the school should be from the same school. For example there are two children from the same family and they are in the same school. They can actually access this application. We can not actually track other schools and/or cross-school tracking. That is the assumption I have.

The concern would be in a particular feature where you can actually register your children inside the app. That doesn't actually work like that. Someone who actually wants a service from this school registers, they'll pay the fees, and then it goes on. It actually depends completely on an offline-in-the-real-world scenario.

These are the assumptions I actually kept in my mind to do this problem solving.

### Who the users are

There are actually two type of users:

1. The parent
2. The driver or the co-driver

Parents are someone who tracks the status of where the bus is actually and the driver and co-driver will probably update the in and out status of their children boarding or offboarding from the bus. This is the users we are targeting to solve this problem.

### User flow, what they do and what they expect

So the parents who have this problem will actually want to solve this problem by being able to track the bus and the route. If the route is changing, they will want to know why this route is changing. If there is any breakdown in the bus, they will want to contact the driver or co-driver. Why is it delayed? Something very basic to monitor, and from the driver's side or the co-driver's side, they will be responsible for updating the status of the child. Something like this is how the user flow works

This user flow can actually connect it to IOT devices like a watch, Alexa, or something like that to actually increase, I mean to be focusing on a point. I would say that in urgent they can actually see all this tracking in their watch or in their IOT devices or something like that. That actually makes it very easy for them to know where exactly the school bus is as good or whether their children have reached the school or something like that. We can actually try and see.

### Metrics, can be tracked, maybe

Something I've actually checked while doing the assignments is having some fake metrics to show how you are going to evaluate this app or scale this app over a period of time.

I'm actually trying to see:

- the time between the code driver, which updates the status for each student, and how easy it is for them to update the status for each student
- How much time it is going to take for the absent flow to reflect if someone is marking a student absent
- How quickly they are reacting to it and not stopping on a particular student's home and moving away
- How quickly they are reacting to it and not stopping on a particular student's home and moving away
- The one we had the map for and how fast it is actually reacting and reflecting to the parents' mobile
- How easy it is for the coder to update the status of all students from start to end

Something roughly I have in my mind to target this metric. Maybe I'm wrong but I don't know. These can actually help us to make a better decision on the next stage.

### The user personas

I've got two personas here, and honestly they cover pretty different situations, which is exactly why I picked them.

**Ayush and Priya**

So this persona is basically a family of three and Ayush and Priya are parents. They work at companies where Priya has to actually go to the office weekly twice or thrice because of the hybrid model but Ayush have to actually go to the office daily. They have a big problem with their son called Arav. He is actually hyperactive and I mean very hyperactive so he cannot be with normal kids and they fear a lot about him. He is studying in 4th grade and the school is very far from their house. They want to actually track Arav. They are very young parents and they are more afraid of sending their child to school so they want to see how it works and they want to try it out. They have a very normal requirement on this.

**Manoj and Divya**

Meet Manoj and Divya. They are not unlike the other persona. They have two children. One is Prathamesh in 3rd grade and Aradhya in 10th grade. Both of them have different time slots for school. One of them has to go early and come early and Aradhya has to go early and come a little late. They have different times and different buses to catch from school.

They want to actually know what is happening with the bus because both of them are working in a personal business and they don't have much time to actually see. If something happens they can take their kids to school or bring them back to home. This is their requirement.

### The four problems, in detail

| Problem | Description | Why it is a problem | Impact on the user | Suggested improvement |
|---|---|---|---|---|
| **Marking absent** | I check this absent tab where I can actually click absent and I can actually undo. I feel that it is a crucial step and it has to be in a different way. | Eliminate error-prone conditions or confirm before a destructive action. | If a parent mis clicks, that can actually go straight to the driver or co driver, so the bus might just skip the stop based on a mistake, not an actual decision. | Can actually have a call button or something to communicate and an yes or no model so that it actually asks for confirmation and writes a small subtext or something like "This is a one-time thing. You cannot change further." This will actually help. |
| **Live journey and alerts** | In the alerts I could actually see a lot of updates just happening. Someone is boarded, someone is off-boarded. The bus has reached the school. All these updates are there. I feel that is not the right way. Also the life journey which is there also shows the same. I think there are very similar things happening over there and we have to actually make things distinct. | Match Between System and the Real World<br>Aesthetic and Minimalist | So this will definitely impact users. Why should they see both the same updates on both sides? In alerts I could see "bus is approaching" and "bus has departed" and the same I can see in track, which was also below that. It's redundant data and it shouldn't be there. | So all of these, we can actually define alerts and live journey. I feel live journey has to be there and alerts have to be there. Alerts can basically have something if the bus is broken down or if it is taking a new route or the bus is not available and parents have to pick their students. In some of these cases this will definitely work. The co-driver or the school has said it's responsible to send all these alerts and it is very crucial updates. Live journey is something they can actually monitor over it and we can actually enhance more on the live journey by adding more information there. |
| **Maps and bus info** | The map right now doesn't look like a real map, it needs an actual map integration, and the route from the stop to school should be drawn like how the quick delivery apps already do it. Bus info is also missing the co driver's number, only the driver's is there. | Visibility of system status<br>Users spend most of their time on other sites/apps, so they prefer yours to work the same way as the ones they already know. | It is all just frustration if someone is standing at the bus stop and the bus is not arriving and they want to call the driver and check sometime. The driver can be changed. All these problems can happen and it will impact the user. | Integrating an app can solve and removing that UI of the bus driver and other things and making it properly arranged into information architecture, then it will definitely help. |
| **Registration** | Without marking absent I could see registration for new students or children. I feel it has nothing to do with the current scenario and it has a different route altogether. | This is actually a product solve not something which relies on usability issues. | It actually doesn't create any impact at all but doesn't also make sense. I think we have to fix it. | Removing could be an option and replacing something with a text message that reaches out to some people or reaches out to the school principal to register your kid or something like that, we can try. |

### Why this priority

There are very few features. According to me I think we have to solve that mark as absent case first. We have to solve live journey and alerts. We have to solve maps, bus info, and the registration part. The registration part is just a product solve so I've kept it in the last one. Basic usability is something we have to cover and that's the order which I've kept.

In this assignment I could actually see a lot of things to be changed in terms of design, in terms of UX or connecting other screens. The prototype itself is limited and there is something prioritized within the features themselves so I have nothing in terms of features to trade off. I just ordered something which has to be fixed properly and then move ahead with a different problem.

### Revamped screens (part 2)

So right now we have actually fixed the UI. After the assignment it is listed in order to say top 3 issues I just saw, why I am prioritizing and assumptions I made. The assumptions I've actually covered in this document and the prioritization that also I've covered. I want to actually explain how the screens help the user to reach their goal in comparison with whatever prototype is given.

![Mark absent flow - mobile](/gallery/school-bus-tracker/mark-absent-mobile.png)

![Mark absent flow - parent portal](/gallery/school-bus-tracker/mark-absent-portal.png)

If you see this image, you can actually see the map, which has a line from the school to the location, and it is very clear and marked properly as per the map. Below you can see it is clearly mentioned: the bus name, the bus number, and the co-driver's call contact CTA. Beside it we have the map and below that we have the time to reach the bus to Pratamesh House. Below that we have the absent CTA so they have also mentioned a particular text to say it is a one-time action and it cannot be undone. In that way it can be a more cautious call to take. In comparison with the prototype it looks very clean and the glanceability is proved here so someone who wants to see this quickly can actually take actions through it.

Secondly I want to actually solve this problem, particularly the alert thing. Alerts are basically, as I assumed:

- the bus may have broken down
- the driver is not picking the children at a particular checkpoint
- the bus is not operating on that day

![Alerts - bus broken down](/gallery/school-bus-tracker/alerts-broken-down-mobile.png)

![Alerts - parent portal](/gallery/school-bus-tracker/alerts-portal.png)

In all these scenarios alerts will work. Alerts need not be monitored on a daily basis so all alerts will project on that day, at that time, whenever parents are opening their app. We have actually made something very clear and it will be upfront on the home page itself. If there is a journey which was continuing there, below you will have the journey. If there is no journey then the journey tab won't be coming there.

![Journey view - mobile](/gallery/school-bus-tracker/journey-mobile.png)

![Mark absent for today - parent portal](/gallery/school-bus-tracker/mark-absent-flow-portal.png)

So the whole flow comes to an end. If someone has marked as absent, it cannot be changed again. If at all they want to actually confirm this or change this, they can try calling the co-driver and update the particular issue. Here we have removed the bus registration form as we discussed earlier in this document. Then we will not be using all these because it's an offline process and below you will have the journey of the bus going from the school to the particular house.

I believe there is some scope for improvement maybe but I've tried to keep these things in my mind:

- mobile first
- glanceability
- time sensitivity
- trust and accuracy
- calm design
- accessibility

I've tried to achieve all this and made this design. Maybe if there is more clarity on the problem, this particular solution can direct to some other way.`,
  },
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

![Zomato's visual selection pattern for delivery instructions](/gallery/Zomato - visual selection.png)

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
  {
    slug: "medrep-making-lab-reports-readable",
    title: "Medrep - Making Lab Reports Readable",
    subtitle: "An AI layer that reads lab reports the way a person would, scan, upload, or type in values, and get a plain-language explanation back.",
    body: `[Medrep - Figma design file](https://www.figma.com/design/MDOJAvuxhmhMVRqvOx5719/Medrep?node-id=0-1)

This started as a take-home design assignment. I have tried to keep the reasoning honest and every design decision grounded in that reasoning.

# What I understood

Most people who get a lab report cannot actually read it. The values and terms are written for a doctor, not for the person holding the printout. What stood out to me while looking into this is that people already open ChatGPT or a similar AI tool and paste their report in, just to make sense of it. That told me the need is real and already being solved badly, since a general AI tool was never built to read a medical report carefully or explain it without causing panic. That gap is what this app is meant to close.

# What the product does

A person can bring their report in three ways, scan it with the camera, upload multiple files at once, or type the values in by hand when there is no file at all. Whichever way it comes in, it lands on the same explanation on the other side, so the input method never changes what the person gets back.

An AI layer reads the report the way a person would, separates what is normal from what needs a second look, and explains it in plain words instead of a list of numbers. This is the part that replaces the ChatGPT workaround people already rely on, except built specifically to read a medical report and stay careful about what it claims.

The app can also connect to a smartwatch to pull in real time readings such as heart rate, BMI, and ECG patterns. These sit next to the lab report so a person can check what the report says against what their own body is showing day to day, without another app or another device.

# Users and their personas

Two personas shaped this design. The first is an older, non-medical adult, comfortable enough with a phone for daily use, but unsure whether a number on a report is something to worry about. The second is a younger, Gen Z user, used to fast and expressive apps, which is part of why the interface leans on bold colour and confident visuals instead of a plain clinical look. I am assuming Gen Z will make up the larger share of early users, and the visual direction follows that assumption on purpose.

In practice, this means someone can open the app, scan a report, and understand what it says in under a minute, without switching to a search engine or a generic AI chat to make sense of it.

# High fidelity screens

The two screens chosen for full colour, typography, and component detail, home and scan entry, and the full blood pressure report with result cards.

![Image](/gallery/pdfs/hifi-screen-01-home.png)

![Image](/gallery/pdfs/hifi-screen-02-report-detail.png)

# Wireframes

The full wireframe set, covering login through history.

![Image](/gallery/pdfs/wireframe-01-login.png)

![Image](/gallery/pdfs/wireframe-02-onboarding-a.png)

![Image](/gallery/pdfs/wireframe-03-onboarding-b.png)

![Image](/gallery/pdfs/wireframe-04-home.png)

![Image](/gallery/pdfs/wireframe-05.png)

![Image](/gallery/pdfs/wireframe-06.png)

![Image](/gallery/pdfs/wireframe-07.png)

![Image](/gallery/pdfs/wireframe-08.png)

![Image](/gallery/pdfs/wireframe-09-history-a.png)

Every report a person adds gets saved automatically, tagged with the date it was read. Opening history shows a simple list, each entry carrying the same short status line the person saw the first time, not the raw report again. Tapping into any past entry opens its full result, so nothing has to be re-scanned to look back at it. Over time, this is also what lets the app show whether a value like cholesterol is moving up, down, or staying the same across visits.

![Image](/gallery/pdfs/wireframe-10-history-b.png)

![Image](/gallery/pdfs/wireframe-11-history-c.png)

# User journey

![Image](/gallery/pdfs/flowchart.png)

The journey opens on a welcome screen, then login through Google or Facebook, so returning is a single tap rather than a form. A short onboarding follows right after, asking for age, weight, height, gender, and any existing condition, before the home screen appears. This context is what lets every explanation that comes later be about the actual person instead of a generic average.

Home is built around one clear action, a plus icon that opens three ways to bring in a report. A person can scan it with the camera, search by symptom when they do not have a report yet, or enter the values themselves when there is no file at all. Whichever path is chosen, a short processing screen confirms the report is being read, not stuck.

The result opens on a plain language status first, an evaluation bar that shows where things stand at a glance, before any individual value. Flagged values sit below it as their own cards, while normal ones stay collapsed out of the way, so the one thing that matters is never lost in the rest.

From there, the person can open any flagged value for more detail, or ask a question directly on the same screen if something still is not clear. Someone who started from a symptom instead of a report lands on this same result screen once their values come in, so the ending is always the same no matter where the journey began.

![Image](/gallery/pdfs/journey-02-camera.png)

![Image](/gallery/pdfs/journey-03-processing.png)

Choosing something like high blood pressure shows the tests usually recommended for it, and from there the person can scan, upload, or type in a result such as an ECG by hand. This path exists for someone who only knows what they are feeling, not what to test for.

Every report is saved to a history screen organised by date, with the same short plain language line the person saw the first time. A report is rarely a one time event, so being able to look back and see whether a value has moved matters as much as reading it the first time.

![Image](/gallery/pdfs/journey-05-symptom-search.png)

![Image](/gallery/pdfs/journey-06-test-panel.png)

![Image](/gallery/pdfs/journey-07-manual-entry.png)

![Image](/gallery/pdfs/journey-08-history-a.png)

![Image](/gallery/pdfs/journey-09-history-b.png)

# Conclusion

The app takes a report in whichever form a person actually has it, reads it the way a person would, and hands back something short enough to act on. Every screen is built to answer one of two questions, what does this mean, and should I be worried, without adding a third question along the way.

I used Claude to cut down on operational work, mainly research, gathering references, and thinking through options quickly, not to design the actual screens. It helped me look at existing tools in this space, work through test panels and medical terminology, and shape the wording on certain screens faster than doing it alone. Every flow, screen decision, and final call in this project is my own.`,
  },
  {
    slug: "foreverstage-deal-intelligence-for-sales-teams",
    title: "Foreverstage - Deal Intelligence for Sales Teams",
    subtitle: "A Deal Intelligence Layer that listens to sales calls, drafts CRM updates for review, and surfaces only what reps, managers, and VPs actually need to see.",
    body: `![Image](/gallery/pdfs/image.png)

This started as a take-home design assignment.

Before I even opened Figma, I wanted to actually understand how a 60 person sales team works day to day, not just guess at it. I dug into Salesforce and HubSpot and their AI features, poked around a few marketplace extensions, and spent time with conversation intelligence tools like Gong, Fireflies, and Fathom. I also thought back to a workflow I'd seen play out at a previous company.

[Everstage - Figma design file](https://www.figma.com/design/cR9fvxsO1tzVFzco9edy4a/Everstage?node-id=50-30)

## Understanding the people behind the process

Instead of trying to map a 60 person sales org, I narrowed the problem down to a single reporting chain, one rep, one manager, one VP. That made it much easier to see how information actually moves from a customer conversation up to leadership.

It's not the whole organisation, just a thin slice of it. But the same pattern repeats across every rep and every manager in the company.

### Meet Venkat, Sales Representative

It's 5:45 PM and Venkat has just finished his eighth customer meeting of the day.

One prospect is excited and asking about pricing. Another has just brought a competitor into the conversation. A third has pushed the decision out to next month because procurement isn't ready yet.

Venkat remembers all of it clearly, none of this is a memory problem.

It's a time problem. He still has follow-up emails to send, tomorrow's meetings to prep for, a commute home, and somewhere in there, the CRM to update.

"Salesforce's own research puts the number at around 30 percent, that's roughly how much of a rep's time actually goes toward selling, with the rest eaten up by admin and internal work." - Salesforce research

The CRM update matters, everyone knows that. But it never feels as urgent as the next deal in front of him. So it gets pushed. Sometimes to tomorrow. Sometimes it just never happens.

### Meet Prashant, Sales Manager

Prashant isn't selling every day anymore. His job has shifted toward coaching the team, reviewing deals, clearing blockers, and keeping the pipeline healthy enough to hit the quarter's number.

The problem is, he only knows what actually makes it into the CRM.

If Venkat forgets to log that a competitor showed up in yesterday's call, Prashant has no way of knowing. If a customer quietly pushes their implementation date during a call and nobody types it in, Prashant keeps assuming the deal is on track.

Bit by bit, his job stops being about coaching and turns into chasing people for updates instead.

### Meet Hari, VP of Sales

Hari doesn't care about any single meeting. He's looking at the bigger picture, which deals are slipping, where revenue is genuinely at risk, whether this quarter's forecast can actually be trusted.

For all of that, he depends on managers like Prashant to have the right answers.

And by the time anything risky actually reaches him, it's usually stale already.

Forecasting doesn't break because people aren't trying hard enough. It breaks because information moves slower than the decisions that depend on it.

### Understanding the sales process

Before designing anything, I wanted to understand how a B2B sales team actually moves a deal forward, not guess at it. I'd worked around sales workflows before, but never done the job myself, so I spent about 15 minutes on a call with someone who works in B2B SaaS sales. That one conversation reframed the entire problem for me. I'd assumed this was about reducing CRM updates. It's not, CRM updates are just the visible tip of a much longer journey, where every conversation nudges an opportunity through a fairly structured pipeline.

![Image](/gallery/pdfs/_-_visual_selection_2.png)

Each stage shift is triggered by something that happened in a real conversation, a new stakeholder joining, a competitor showing up, procurement stalling. None of it matters for forecasting unless someone captures it, and that's exactly where the friction starts.

## Design thinking and decisions

Before getting into the actual solution, I want to walk through the questions I asked myself along the way, the ones that shaped scope, users, and where AI should and shouldn't be involved.

**1. What is my understanding of the problem?** I started out thinking this was a CRM adoption problem, but that doesn't hold up once you look at what's already out there. Gong, Fireflies, Fathom, Agentforce have all solved note-taking and CRM sync already, and the pain is still there. So really, this is a timing problem. The information's already out there, it just doesn't reach the right person fast enough.

**2. What assumptions am I making?** I'm assuming the company keeps whatever CRM they're already on, this sits alongside it, not instead of it. Reps are optimising for selling, not paperwork, so anything that adds to their plate just won't stick. Managers want the short version, not a full transcript, and leadership just wants to know if the forecast can be trusted.

**3. What am I solving, and what am I leaving out?** I picked four things to focus on, pulling details out of conversations automatically, letting AI draft the CRM update instead of the rep typing it, only pinging managers when something actually needs their attention, and catching risk early instead of finding out in the forecast call. Everything else, coaching, outbound, pricing, replacing the CRM itself, I left alone on purpose. Better to nail one thing than half-do five.

**4. Where does AI help, and where could it get in the way?** AI's good at the boring stuff, summarising, pulling out action items, flagging when a competitor comes up. None of that needs real judgement. What it shouldn't touch is anything that moves the needle, changing a stage, locking a forecast number, sending an email without someone checking it first. Every suggestion needs a paper trail back to where it came from.

**5. What trade-offs did I make?** I picked suggestions over full automation, because a wrong auto-update is worse than one extra click. I picked fewer, more meaningful alerts over flooding managers with every update. I kept it inside the CRM instead of building a separate app, since that's where reps already live. And I leaned on explainability over anything that felt like a black box, since in enterprise software, that's what actually gets people to trust it.

## Product vision

Instead of replacing Salesforce, HubSpot, Zoho or Dynamics, I designed this as a Deal Intelligence Layer that integrates with whatever CRM a company is already using. It listens to customer conversations, understands commercial context, prepares CRM updates for human review, and delivers role specific intelligence across the sales organisation.

### From conversation to deal intelligence

Every customer conversation carries real business context, but most of it stays stuck inside a call, an email thread, or just in the rep's head. Instead of building another tool, I designed an AI layer that sits inside the existing CRM and works quietly alongside how the sales team already operates. The point is simple, cut manual reporting, and get the right information to the right person at the right time.

![Image](/gallery/pdfs/_-_visual_selection_5.png)

**Rep, then AI, then CRM**

- Venkat takes the call, whether it's Zoom, Meet, or whatever the team's using
- AI transcribes it in the background as it happens
- It links the conversation to the right account, opportunity, and stage automatically
- It pulls out what actually matters, where the deal stage is moving, how sentiment is shifting, any competitor that got mentioned, who the champion is, budget conversations, risks or blockers, and next steps
- Instead of dumping raw notes, it drafts a clean, structured CRM update
- Venkat reviews it, tweaks anything that's off, and approves it
- Only then does it actually hit the CRM

He's not writing notes anymore, he's just checking a draft for a few seconds. That keeps him accountable for what goes in, without eating into his day. The CRM stays the single source of truth, it's just far less painful to keep it that way.

**CRM, then manager, then leadership**

- Once Venkat approves it, it flows straight into the opportunity timeline
- Prashant doesn't read transcripts, he gets a prioritized view instead
- AI only flags what's worth his attention, deals slipping into risk, timelines moving, a new competitor showing up, changes in the buying committee, budget or procurement delays
- From there, he decides what to do with it, coach Venkat directly, escalate a risk internally, pull in extra resources, jump into a customer call himself, or clear a blocker
- Across the whole pipeline, AI keeps rolling this up into account-level intelligence
- Hari doesn't touch individual deals, he gets the executive summary, forecast confidence, pipeline health, revenue risk, all in one place
- The AI's job stops at advising. Every real decision stays with Prashant and Hari

## A day with Venkat

![Image](/gallery/pdfs/_-_visual_selection_4.png)

Venkat wraps up the AstraZeneca call and switches to his Today screen. The draft is already sitting there under Start here, deal stage, evidence, next step, instead of a blank form waiting for him to fill it in.

![Image](/gallery/pdfs/591436f4-d0d1-48fa-a167-4b9241165893.png)

![Image](/gallery/pdfs/18337f96-d13c-4680-bf60-bd8babd893ef.png)

Figma annotation: the stat row at the top, Decisions, Waiting, Slipping, is a live aggregate, not a static label. The Leads list below it stays hand-tracked by the rep, kept separate from the AI-extracted signal below, since a rep's own early-stage prospecting list isn't something AI should be inventing on its own.

![Image](/gallery/pdfs/image%201.png)

Keeping that line clear, what stays manual versus what AI surfaces, was one of the harder calls in this design. It would have been easy to let AI take over the leads list too, and that's exactly the kind of overreach question four was meant to catch.

## Prashant's morning

Instead of opening five different views to check on his team, Prashant sees one ranked list on his Team screen, which deals are going quiet, which are slipping into risk, which need his call today.

**Flow:** New signal detected across the team, risk and silent-deal stats recompute, one pending approval surfaces inline, Prashant approves, coaches, or escalates, coaching list re-ranks by stalled-deal ratio.

![Image](/gallery/pdfs/cf96d497-d013-4a04-bf17-e5c5c405ca04.png)

The coaching priority list at the bottom isn't sorted by pipeline size. It's sorted by what share of each rep's deals have gone quiet, so Prashant's biggest account isn't automatically what gets his first hour.

That one design choice matters more than it looks. A manager who only ever gets pointed at the biggest deal ends up coaching the same one or two reps every week. Ranking by stalled ratio instead means a smaller account going silent gets seen just as fast as a large one slipping.

![Image](/gallery/pdfs/image%202.png)

## Hari's weekly review

Hari opens his Executive Brief on Monday morning. He doesn't touch a single deal record here. He reads two short paragraphs on where the quarter stands, written fresh from that week's actual calls and forecast movement, then a region-by-region view of where risk is concentrated.

![Image](/gallery/pdfs/_-_visual_selection_3.png)

![Image](/gallery/pdfs/b0fa3018-d8d9-410a-8b77-d67c838b78d3.png)

The narrative names a root cause, not just a number. Six of nine high-risk deals are stuck on the same security review step. That's a process fix Hari can act on, which a plain percentage change would never have surfaced.

![Image](/gallery/pdfs/ba507030-922e-4e6f-a5cf-72ea98a5b2cc.png)

Every decision that reaches Hari's screen has already been through Venkat's approval and Prashant's judgement. He's the last stop, not the first person reading raw signal.

## Every decision in one place

Every AI-drafted decision across the company, whether it belongs to a rep, a manager, or a VP, lands in one shared inbox, filterable by CRM update, stage change, or risk.

![Image](/gallery/pdfs/17be4cdb-b776-4ba2-9a3c-4898797f7360.png)

Each card shows the proposed change next to the exact line from the call it came from, so approving something is never a leap of faith. There's no partial state between approved and rejected. Anything a rep disagrees with gets edited inline before it's approved, rather than left half-applied.

## Product decisions

Some of the calls behind this design, and why I made them.

AI drafts, people decide. Every CRM update, stage change, or risk flag stays a proposal until a human approves it. I went back and forth on this. Full automation is faster, but a wrong auto-update costs more trust than the time it saves, especially early on, when people are still deciding whether to believe the system at all.

Managers get evidence, not transcripts. Reading every call a rep has had isn't a realistic use of a manager's day, so what reaches Prashant is a short flag with the one line of evidence behind it, not the full recording.

Leadership sees intelligence, not raw activity. Hari's screen never shows a CRM field changing, it shows what that change means for the forecast.

## Design considerations

Since this is a **B2B CRM platform**, I intentionally prioritized usability over visual richness. Users spend long hours completing functional tasks, so I wanted the interface to stay clean, predictable, and distraction-free. Instead of investing heavily in visual treatments, I focused on improving the **UX, product logic, workflows, and information hierarchy**. My goal was to help users complete tasks faster and more efficiently rather than make the interface visually flashy.

![Image](/gallery/pdfs/Component_Gallery.png)

A sales rep isn't always looking at this screen at their desk. Half the day happens between meetings, in a car, on a client's porch, in direct sunlight where low-contrast UI just disappears. So the design system leans on WCAG AA contrast minimums everywhere, not as a compliance checkbox but because a rep glancing at their phone outdoors needs the same five seconds indoors or out.

![Image](/gallery/pdfs/style-guide-colors.png)

Every background, text, and status colour pair in the system is checked against WCAG AA, 4.5:1 for text, before it ships. Nothing relies on a light tint alone to carry meaning.

![Image](/gallery/pdfs/style-guide-typography.png)

The type scale stays large and heavy at the sizes that matter most on a phone screen, Body and Label styles are weighted for legibility first, decoration second.

![Image](/gallery/pdfs/style-guide-spacing.png)

Spacing and touch targets follow a consistent scale, so a rep tapping Approve while walking to their car doesn't need a precise, well-lit tap to get it right.

## What I learned

This assignment started with a fairly common assumption, that the biggest problem was getting sales reps to update the CRM. Through research, a conversation with someone in B2B sales, and studying existing revenue intelligence platforms, I realized the real challenge wasn't documentation. It was making sure customer intelligence reached the right person before it went stale.

The thing that surprised me most, selling is only half the job. After every meeting, a rep is also updating CRM fields, logging next steps, tracking competitors, flagging objections, and drafting follow-ups. A full second job that never shows up on a scoreboard.

I also picked up a concept that shaped my thinking a lot, the "Champion", someone inside the customer's org who backs your product internally. Winning them over doesn't mean winning the deal, it still has to survive budget approval, procurement, and legal. Along the way, different stakeholders push back in different ways, and those objections are the signal a manager genuinely needs. They just rarely get written down in time.`,
  },
  {
    slug: "coinpedia-redesign-concept",
    title: "Coinpedia - Redesign Concept",
    subtitle: "A UI/UX redesign of Coinpedia's market and Bitcoin pages, focused on cleaner data visualization and layout.",
    body: `I did this study for my own purpose, working as the UX designer over a 2–3 day duration, focused on the redesign of the Coinpedia website in terms of both the user interface and the user experience.

## 01 Introduction

I guess you are familiar with these cryptography and web3-related technologies; they have a lot of data, and I really don’t know which numerical data is important, to be honest. After doing intensive research, I started making UI screens in my mind, then I started playing with the rectangles and made all components one by one in random order, then stacked them as per IA. The IA that I read helped me to arrange everything in a visual hierarchy, and I did a good job in terms of interaction too. So let's dive deeper to learn more about my work.

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Coinpedia - Re-design - Ultimez/Frame_44.png)

### Challenge

Coinpedia is a trusted cryptocurrency, event, and information service agency for blockchain technology and overall digital assets. Moreover, this is an entirely independent platform that covers blockchain, cryptocurrency, and decentralized applications. And much other crypto information from the next-generation web. The challenge is to redesign the main page of Coinpedia and a currency page called Bitcoin. It has mentioned to redesign completely by colors, typography, imagery, and the way I can do it creatively, but it should be done in a way that increases user visit rate, accessibility, and usability too.

### Goal

The goal is to make users retrain back on the website, create interactions, and make them comfortable. I will be achieving this by observing the whole website, writing down the errors, designing components, and placing them in a structured way.

## 02 Initial Findings

Initially, when I saw this website, I liked the aesthetics part, as they are using dark blue. It actually gives a lot of trust and stability. For instance, if someone is going to invest in a crypto currency and searches for some better stat sites that can give a lot of information about the currency, they may land on Coinpedia. There is a chance that he will get comforted about crypto and all. They also have small help icons to help out with what and why types of questions to clarify users doubts.

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Coinpedia - Re-design - Ultimez/Untitled.jpg)

Market page of Coinpedia - Tab version

Secondly, I saw those fonts, and I didn’t like them much, but the designer who did this must have done it with the intention of improving readability in non-display sizes. I knew this font before; it is called Space Grotesk. This made a few numbers confusing due to the typeface.

I have seen a lot of errors on this website and lags due to the high dynamic data, which is changing every 5 minutes. There is a lag in the interaction part too, which I have fixed by changing its complex layout to a simpler one. I didn’t feel much needed to be changed. So I only fixed and gave a newly polished website with enhancements in fonts, visual appeal, and accessibility.

### Target Audience

Investors

Millennials

Gen Z

Gamers

## 03 Ideation - Re-design

Whenever I do redesign any digital product, I always follow this rule at first pace;

“Usually Choose Incremental Changes Over a Major Overhaul” - Nielsen Norman Group

As I said before in the overview, there are a few minimum changes that can enhance the webpages very much and actually create impact. I started with the navbar itself; initially, the menus were placed very left, and there I found two types of buttons: portfolio tracking and login. I changed all these in the most minimal way possible.

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Coinpedia - Re-design - Ultimez/Untitled 1.jpg)

Old Design - Market

Generally, whenever redesigns of webpages are done, they always do user research first to structure the audience and users who are using them, and they will design a user-centric approach to drive a better result by specifically targeting the audience, but in this case, I am doing an assessment and I have time constraints, So I didn’t go there.

### Wireframe

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Coinpedia - Re-design - Ultimez/wireframe.png)

Wireframe

## 04 Screens

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Coinpedia - Re-design - Ultimez/mp.jpg)

Market Place Page Redesign

The redesigned Market Place Page focuses on structured components, high-contrast elements, and a clean search experience. The primary call-to-actions are aligned for optimal conversion, and cryptocurrency stats are displayed in a clean ticker format.

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Coinpedia - Re-design - Ultimez/BTC.jpg)

Bitcoin Page Redesign

The redesigned Bitcoin Page leverages a responsive Bento Box layout to group cryptocurrency statistics. Critical metrics like supply, investor sentiment, and community trust are presented using customized data visualization components for instant comprehension.

## 05 Redesign Details & Breakdowns

### Market Place Page Features

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Coinpedia - Re-design - Ultimez/ovl.jpg)

Search Bar Redesign

I redesigned the button components and contrast ratios for better aesthetic appeal. Given the huge number of cryptocurrencies, a prominent search interface gives users the freedom to investigate, search, and uncover new insights.

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Coinpedia - Re-design - Ultimez/nav1.jpg)

Navbar Changes & Portfolio

- The updated CTA buttons are visible in the header above. The primary navbar action focuses on the login button and the currency selector to attract users, matching best practices of major financial information sites.
- The “Track your portfolio” feature was moved down to satisfy the usability heuristic of recognition over recall, reducing cognitive load on users.

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Coinpedia - Re-design - Ultimez/nav2.jpg)

Cryptocurrency Feed & Settings

- Features like Dark Mode and Notifications were relocated to the user account settings, where they are more relevant.
- The updated dropdown and button now clearly allow changing currency/country and highlight the primary login CTA.
- Crypto details are placed at the top like a stock market ticker, showing rolling price information.

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Coinpedia - Re-design - Ultimez/nav3.jpg)

Simplified Header & Filters

- The static market cap header has been cleaned up and greeting messages for users have been removed to keep the interface professional and dynamic.
- I used highly legible icons and consolidated the category list into a simplified dropdown menu so that users can tap and filter selections with ease.

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Coinpedia - Re-design - Ultimez/container.png)

Layout Redesign Overview

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Coinpedia - Re-design - Ultimez/er1.png)

Error State & Responsiveness

### Bitcoin Page Features

I redesigned components like supply, sentiment indicators, and community support.

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Coinpedia - Re-design - Ultimez/Untitled 2.jpg)

Old Design - Overview

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Coinpedia - Re-design - Ultimez/Untitled 3.jpg)

Old Design - Details

Containers

The page features graphs and charts that present numerical data visually. I optimized these using data visualization principles to ensure stats are easy to comprehend.

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Coinpedia - Re-design - Ultimez/chart1.png)

Supply Metric Redesign

Since the supply metric represents three distinct variables, I chose a clean bar chart to convey clear and readable supply statistics.

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Coinpedia - Re-design - Ultimez/chart2.png)

Sentiment Indicator Speedometer

I designed the sentiment indicator in a minimal way as a speedometer indicating strong buy/sell volumes to help adopters gauge trust levels.

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Coinpedia - Re-design - Ultimez/chart3.png)

Community Trust Voting

Community trust metrics are essential for information portals to build adopter confidence. I redesigned this section to encourage clear and easy voting on currency sentiments.

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Coinpedia - Re-design - Ultimez/Untitled 4.jpg)

Bento Layout & Action Buttons

- I adopted a “Bento box” layout style to group currency infographics, ensuring that the visual components scale responsively.
- All interactive primary buttons were updated from grayish tones to the brand's primary color with clean, filled icons.

## 06 Styles

I used a sans-serif typeface for better readability, and it is always suggested for fintech information websites to clearly showcase the numerical data. I also used layout grids to maintain visual order, and they are focused on the center of the website. The font is very legible and mostly used in many websites for avoiding issues in low-resolution part, these type of fonts gives modern and clean communication.

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Coinpedia - Re-design - Ultimez/Styles.png)

Styles

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Coinpedia - Re-design - Ultimez/Untitled 5.jpg)

Layout grid.

So, by using the layout grid and Figma's rulers, the information is organized and there is an equal spacing between the containers, which aids in the conversion to mobile format.

## 07 Conclusion

Lastly, I would conclude that the enhancements to the website features of Coinpedia have been discussed, and the usability aspects have been covered. My findings highlight the UX mentioned in the redesign study. These opportunities will not only maintain existing users but will also attract a larger audience.

[Coinpedia - Figma design file](https://www.figma.com/file/6ZkoOapePsdkOyufWe2AFJ/Coinpedia?type=design&node-id=0%3A1&mode=design&t=jeAIhcvEIijAcTUs-1)`,
  },
  {
    slug: "real-estate-platforms-competitive-ux-audit",
    title: "Real Estate Platforms - Competitive UX Audit",
    subtitle: "A comparative UX audit of 99acres, Housing.com, and Magicbricks - usability, navigation, and brand trust.",
    body: `### Introduction

In this competitive analysis, I am going to share insights on real estate websites like 99Acre, Housing, and Magicbricks and their SWOT analysis. As they feature, almost everyone can access them as they are working for more than 100 websites, and yes, I am going to list out everything that I found as a insight. I will try to make all the positives and negatives unbiased.

I have heard that housing.com in recent days, like a few years ago, and 99acres are the real O.G. of digital real estate, but actually they lack the latest feature trends. We will see all these in a detailed manner. Although people use 99acres rather than housing because it has legit listings, housing has tons of fraudulent listings. I read this in the Quora forum.

Every popular real estate website has a backed-up company or has partners from the past; the most known are 99acre from Naukri Group and Magicbricks from Times Group.

Note : I am doing this for my personal purpose as a research task. The duration of this task is 2 days, and my role here in this study is only to analyze the best and most missed features that they provide to users in terms of user experience.

All this testing and exploring of websites is done through incognito profiles not from cached personal profiles to extract the actual content.

### Goal

To make this more informative and to extract insights from the websites, we will go through the SWOT analysis and competitive research on those websites. In terms of the features, I will go through the user experience at first. Following that, I will do a competitive UX audit with categories specifically.

### Website Evaluation

These three websites are the target, and I have collected a generic feature list in which the real estate companies should basically focus on these things.

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Competitive Audit - Real Estate sites/logo.png)

Market Analysis

| Features | 99acres | Magicbricks | Housing.com |
|---|---|---|---|
| **Company Info** | Launched in 2005 | Launched in 2006 | Launched in 2012 |
| **Description** | Online advertising for buyers, sellers, brokers/agents. | Flats, Villa, buying, selling, Online services, PG | New homes, resale homes, rentals, plots and co-living spaces. |
| **Annual Revenue** | > $1B | $25M - $50M | > $1B |
| **Partners or Companies** | Naukri | Times | Rea, Makaan, Proptiger |

Screenshots

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Competitive Audit - Real Estate sites/Untitled.jpg)

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Competitive Audit - Real Estate sites/Untitled 1.jpg)

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Competitive Audit - Real Estate sites/Untitled 2.jpg)

Impressions - UI

After going through the first impressions on all three websites, it feels like housing.com has done significant work in designing their website. I really like their aesthetics and visual appeal. Coming to 99acres, I felt a good design with what a user actually needed from their end. They do have headers with a slight animated dropdown, and it is seamless. In Magicbricks, the fonts are in regular styles, which feel a little odd compared to them. The red-colored layout matches the brand name and identity. It is not up to par when compared with other sites.

### Competitive Analysis

I have made this more simple form to provide an overview of all these websites in three sections, respectively. This process can also be called competitive user experience auditing, where we can understand the sole purpose and features of the concerned companies.

- Information & Stats

- Features & Interface

- Flow & Visuals

### Information & Stats

| Companies | Competitor Type | Target Location(s) | Audience | Premium Unique Value Proposition |
|---|---|---|---|---|
| 99acre | Direct | Primary - India<br>Secondary - Dubai<br>International Site - Broken | Age - 25 to 34<br>Gender - 72% Male<br>Software developers | Buying 899/ 2 months<br>8 Contacts<br>Customized Plans for upgrading and inclusive for all type of users |
| Magicbricks | Direct | Primary - India | Age - 25 to 34<br>Gender - 72% Male<br>Software developers | 1199/30 Contacts<br>Property Services and Legal services |
| Housing | Direct | Primary - India<br>International - More countries | Age - 25 to 34<br>Gender - 72% Male<br>Software developers | 1099+18% GST = 1297<br>25 Contacts<br>90 Days<br>Visual Design, International search, Edge featured. |

### Features & Interface

Rated - Need Work → Okay → Good → Great+
+ → Positive | - → Negative

| Companies | Desktop View | Mobile View | Features | Accessibility |
|---|---|---|---|---|
| 99acre | Okay<br>+ interface with blue color is good<br>+ search bar is minimal and exact<br>- search button can be big<br>- help is not clearly visible | Great<br>+ Optimized design<br>+ easy to see filters and sorts<br>- icons take time to load | Good<br>+ each property has detailed facilities illustration<br>+ price trends are good<br>+ bank loan links<br>- no proper images, few show 3d few show 2d | Okay<br>+ new users are automatically created to save<br>+ sitemap provided<br>+ voice search<br>- No language selection |
| Magicbricks | Good<br>+ Minimal feel<br>+ navbar architecture is good<br>- font isn’t good<br>- some areas feel empty | Okay<br>+ has optimized view<br>+ navbar to search filters for alternate is good<br>- bottom navbar has mb prime | Okay<br>+ prices and trends of whole city<br>- does not save any user data<br>- everything needs a account<br>- prime pack details unavailable | Good<br>+ help center is in navbar<br>- the animation from cards lags<br>- small fonts used in sub paragraphs |
| Housing | Good<br>+ UI is really great<br>+ search bar changes with banner is good<br>+ listing features - images can be interacted by animation | Good<br>+ Optimized for mobile main page<br>+ Saved search<br>- scrollable feature list<br>- Maps are not optimized<br>- not all pages are responsive | Great<br>+ international flats is good<br>+ search filters are minimal<br>+ various properties from single seller<br>+ request tour, rent-o-meter | Good<br>+ Languages available<br>+ has quick links<br>- fonts can have higher sizes |

### Flow and Visuals

Rated - Need Work → Okay → Good → Great+
+ → Positive | - → Negative

| Companies | User Flow | Navigation | Brand identity | Tone |
|---|---|---|---|---|
| 99acre | Good<br>+ user can reach what they want<br>+ easily memorable<br>+ takes nearest city from google locations and recommends | Need work<br>+ has all features listed in navbar main page<br>- no tutorial or hints<br>- navbar shadow hides dropdowns<br>- doesn’t has option to navigate from other pages<br>- quicks links no response | Good<br>+ strong brand and colors, typo, images, clean transitions<br>- no semantic colors | Good<br>Formal and generic |
| Magicbricks | Good<br>+ takes nearest city from google locations and recommends<br>+ gives what exactly needed like price breakup, loans in view<br>+ Memorable flow<br>- no mortgage calculator | Great<br>+ easy to navigate with old searches<br>+ navbar is good with help in menu<br>+ easy to find property holders<br>+ has chatbot for further help<br>- International listings doesn’t works | Okay<br>+ okay UI and typo fonts<br>+ semantic colors | Good<br>very Formal and generic |
| Housing | Good<br>+ takes nearest city from google locations and recommends<br>+ Easy to find things<br>+ shows popular listings near location<br>- Can’t memorize - same hierarchy | Great<br>+ easy navigation for users with clean navbar<br>+ shows stats in cards<br>+ easy search and compare | Great<br>+ strong brand and colors, typo, images, clean transitions<br>+ all rounder to all websites in real estate<br>+ semantic colors | Good<br>Friendly and Fun |

All these testing tasks were executed using specific search scenarios to evaluate the platforms under realistic constraints:

- **Simran (Bengaluru):** A new trainee searching for a PG under ₹20,000 with all amenities.
- **Tawfiq (Delhi):** A contract worker seeking a studio apartment on rent for 2–3 months close to his client.
- **Mugilan (Hyderabad):** A promoted employee looking for a newly possessed, furnished 2 BHK house under ₹40,000 near KG schools.

These targeted scenarios helped analyze user flows, filters, and responsiveness in real-time under identical search goals.

Fun fact

I increased 5% website traffic in these companies in this competitive analysis and by research prompts. Now I am currently getting tons of property ads on my social media. I don’t know how they track me, even if I was using incognito; I guess the ads relay through my IP.

### SWOT Analysis

I have made a competitive analysis and found verdicts which I will discuss in the SWOT analysis in more detailed way.

### Strengths

📌

Housing and 99acre have good visual aesthetics and Color usage.

📌

Magicbricks have reasonable pricing for connecting sellers of INR 1099/30 contacts one time.

📌

Housing has language support and better accessibility by using semantic colors.

📌

Magicbricks have Chatbot support for instant help.

📌

Housing have Edge features like loan, credit related which makes more users to get attention.

### Weaknesses

📌

All these websites lags in mobile view, but 99acres is better than others in this fact.

📌

99acres lacks in navigating tasks for new users.

📌

Magicbricks user interface got to be enhanced more on fonts and layouts.

📌

Housing’s images for properties are not consistent either 2D or 3D.

📌

International properties are broken links in Magicbricks and 99acre.

📌

Poor app marketing

### Opportunities

📌

Providing better navbar with exactly what users need.

📌

Adding and improving properties from 3rd Tier cities.

📌

Chatbot integration and AI enabled sites to drive more insights.

📌

Using D-apps or Gen AI can remove scam listings

📌

Onboarding new users or a hint tutorial can be introduced.

📌

Accessibility in terms of fonts, color contrast and magnifying capabilities.

### Threats

📌

Housing has lot of features but very less people who built trust will use.

📌

Lots of fraudulent and scams through these platforms are made.

📌

Sites majorly targets age groups of 25 - 34, which lacks trust of above 34.

📌

There are more other specific need competitors than these sites.

📌

Average visit duration is getting low due to inefficient user flow.

📌

There are more other specific need competitors like commonfloor than these sites.

### Conclusion

My findings highlight the importance of ongoing development in terms of UX, mobile optimization, and features in mentioned in the audit. These opportunities will not only maintain existing users, but will also attract a larger audience, with long-term growth and competitiveness in the real estate market.Thanks for reading till the end and have a great day!`,
  },
  {
    slug: "foundit-landing-page-ux-case-study",
    title: "FoundIt - Landing Page UX Case Study",
    subtitle: "A responsive landing page redesign for FoundIt (formerly Monster.com), putting job search front and center.",
    body: `I made this for a UI/UX design contest run by Zuno, then decided to write it up properly for my portfolio too. Whenever a brand changes, people still stick with their past experience of the website, so the change doesn't reach their expectations the way it's meant to - a few of my insights on where FoundIt falls into that gap.

## 01 Introduction

We all know how monster.com, a legacy job search portal vanished by Indeed.com. The monster website went on low stocks due to the unfulfillment of the founders' vision of making Profiles instead of resumes and not making good user experience trends. This downfall is because they thought of applying the algorithm of LinkedIn to create profiles and make the users stick with the website even after not using the Monster website back in the day. They also lost their way by not efficiently using data and the internet, So the competitors filled the void with data and networking. After ages, Quess took the monster and rebranded as Foundit, a Website for freshers and job seekers to search for jobs and internships with a layout like LinkedIn, Glassdoor, and Indeed. Here, I will go through this website and review my insights into this case study.

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/FoundIt - UX Case Study/Group_32.png)

Sketching points and flow

### Problem Statement

The challenge is to design a successful landing page for Foundit that effectively communicates the organization's message and provides an optimal user experience. In order to accomplish this, a thorough understanding of the organization's mission, target audience, and desired user experience is necessary. The website lacks responsiveness and does not effectively highlight job search functionality on the landing page. Additionally, the website lags behind its competitors in user experience and marketing efforts

### Goal

The goal is to refine the website to meet the needs of its target audience, including professionals, freshers, and recruiters. For a better analysis of this website as it has changed from Monster to foundIt, I will be recording this way better by observations , statistics , persona and all the aspects which causes this new website to standout among the competitors.

### Core Objective of Case Study

- Record Observations

- UX Recommendations

- Design Concepts

- Key Persona

- Suggestions

## 02 Website Evaluation

My Analysis - First Impressions

First of all, the website is not responsive. I came to know this when I did testing throughout the website. Secondly , I went through the landing page of FoundIt where I can barely see the focus to hit a job search. From the first impressions of the website, it wasn't good as it looks like a faulty website. I took this as a problem statement as I like to change things that existed than to start from scratch.

### Challenges

- About the experience , little lagging behind because its competitors are far quicker than Found it

- Landing page is not making into focus to search jobs , log in and registering users are placed with a ham icon in desktop site itself

-  Monster Inc is missing that can take this brand to bigger level

- No proper marketing on the mobile app

- Popular searches or Recent jobs missing

### Target Audience

- Professionals

- Freshers

- Companies (Talent & Recruiters)

### Needs

- Freshers can seek paid internships as those are main ways of getting motivation to work through Zuno , Which is a side start of Foundit.

- To get a better experience to the user

- All devices

- Services can be in landing page for better viewing and accessing

## 03 Market Analysis

Competitive Analysis

- Glassdoor

- Indeed

- LinkedIn

- Wellfound

Assumptions & Consideration

I assume foundIt is making their website far better by this event , So the considering the devices they use and all. The branding is an addon point to them because people still stick with older websites as they do their services good enough. It is easier to find a job by using its own services like resume builder and LinkedIn Makeover , So there are some scope of refining the website. Also they are looking into the the ecosystem too.

## 04 The Approach

- **Empathize:** Researching target segments and user frustrations
- **Define:** Formatting pain points, gains, and personas
- **Ideate:** Brainstorming interface solutions and layouts
- **Prototype:** Creating interactive low & high-fidelity wireframes
- **Test:** Validating design iterations and user flows

## Empathize

In these Five stages of approach this can achieve a better landing page by making the job search to the focus. Although the empathize phase should be as end user exhaustive testing but , we can go with the online sources which forms qualitative as well as quantitative user research. This is basically full of assumptions and considerations.

## Define

First of all we need to understand our users need by defining the type of users , this would be most important factor while developing a product. I have defined 4 types of user persona.

Absolute 3rd Year

- I need a paid internship
- I need experience and exposure from a company
- I need at least 3 LPA

Mindset

Name: Harish E

Age: 20

Harish is a 3rd year undergraduate student who is trying to secure a job in a tech-based MNC for a design fresher job after completing his degree in four years. However, he is afraid of not performing well in certain rounds of the interview process. As a result, he has found it helpful to participate in mock interviews to improve his chances of getting a good job as a fresher.

5 Years XP

- I am bored of working here , I don’t like this work culture
- I need 8% hike for my role
- I need to change my field

Mindset

Name: Vishnu

Age: 25

Vishnu is a UI/UX designer in a company and also has worked as intern as well as full time employee with a good design knowledge but he is facing financial issues as he is not getting well paid in current role so he need a change of field or good company with good salary hike. He lives in a metropolitical city so he need to manage his expenses as well

Leech

- I have worked 2 decades in this company , surely I will get 2X
- I will join some high designation role in core company

Mindset

Name: Madhusudanan

Age: 48

Madhusudanan has been a long-time employee of a company, having worked there for two decades. He is hoping to obtain a significant salary increase or a high-level position within the organization. He is working same as position he came before 20 years , He needs a change.

Services Alone

- I need a resume which can pass with a application tracking system
- I need certified courses

Mindset

Name: Mugilan

Age: 20

Mugilan is a young graduate with a degree in BSc, who has just started his job search. As a fresher, he is looking for a website that can provide him with an easy-to-use platform that can help him create an ATS-free resume. Mugilan is aware of the importance of creating a good first impression with his resume, and he wants to ensure that his skills and experience are accurately reflected.

### Empathy Map

An empathy map can help to gain insights into what users see and do, hear, think, and feel when interacting with a product or service. This can be achieved by conducting user research, such as interviews or observations, and analyzing the data to create the empathy map.

I created for Absolute 3rd Year

Think & Feel

- Will I get a job
- college offers only coding or programming jobs
- Can I clear Aptitude round?
- Will I get a job under my passion niche
- Can I grow myself and independent?

See

- My friends are getting placed in MNC’s for entry level job
- I couldn’t see good recommending jobsite without fake job listings.
- I can see many people are getting a good pay in my field as a fresher
- Freelancing are in trend
- There are years of bond more than 2 years

Say & Do

- Attending workshops and events to secure a job
- Listening to random persons and following them
- Still trying to get job in his interest
- Asking for referral in big MNC for job
- Creating case study and getting mentored from industry person So that he could attend interviews.

Hear

- Faculties suggesting to get placed in on campus
- Friends are planning to go for higher studies for more specific study work
- Going for a any job for now is good due to recession
- To try alternate instead of his passionate work

### Pain and Gain

Pain Points

- If I couldn’t get a job I should go for walk in interviews it will be hassle
- I may get a job from my university , what if it is a BPO or any call center jobs?
- I have to grew with my family , I couldn’t secure a good job
- Walk in drive may have more rounds of interview
- Nobody is hiring for freshers
- Top tier colleges are getting better packages

Gain Points

- Using AI enabled jobsites can be useful
- Applying for multiple jobs through good jobsite
- Lot of features with a jobsite can filter out my resume without ATS
- I can apply for more jobs till I get the perfect one
- Quick apply to jobs without filling from scratch
- Detailed job description for all type of job listings

## Ideate

After making all research with above , Lets indulge all into a idea were we discuss about the solution. This phase is called ideation where this can bring up solution to the problem and as well as idea for making it optimized.

Responsive Layout

- Pain: This website sucks in Tab and Mobile versions
- Pain: Users can’t take updates through mobile phones
- Solution: The visual appealing of a design should be usable for all devices , So the users can use through all devices
- Solution: Use popular JS frameworks such as React to make it seamless and quick response

Visual Design

- Pain: The old monster website was clean and natural , It was easy to use than the new rebranded Foundit.
- Pain: I can’t see some features that allows me to do such task here.
- Solution: Try to make some references from old website when ever rebranded into new , So that you can pull old as well as new users to daily traffic
- Solution: Foundit website should do color theory tinkering with purple color
- Solution: Aesthetics of design should be improved all over the website using design kits.

Business View

- Pain: Foundit header has list of features where it has a tag of “Premium Services” , So the users who are students clearly get that it is a paid thing and the will not explore about whatever you have there
- Pain: There are lot of services which will really helpful to students and freshers are not mentioned in landing page.
- Pain: Bad Consumer support from foundIt and no basic chat bot support
- Pain: Unverified job resources and inserting lot of premium services
- Solution: Remove Premium , So it will give chance to at least to explore the services foundIt offers to its users.
- Solution: Adding a basic dialog flow chatbot , So I can prepare for worst case for users and provide basic support
- Solution: Job postings are done with multiple verifications and It should be same website as foundit

## Prototype

Low fidelity

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/FoundIt - UX Case Study/Group_40480.png)

Desktop Size - 1280×832

It is the critical component that allows us to test ideas, gather insights, and perfect designs before they are released to the public. In the ever-changing world of UX, effective prototyping pipelines have shown to be the cornerstone that minimizes wasted resources and reduces the need for iterative design processes. It protects against missed opportunities. The above prototype is based on Foundit’s design guidelines and I have made for both desktop and mobile versions. This is the basic step before going into fully functional design where it can trace out the needed thing such as layout of the website.

High Fidelity

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/FoundIt - UX Case Study/123.png)

Before and After

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/FoundIt - UX Case Study/Untitled.png)

Before and After

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/FoundIt - UX Case Study/Untitled 1.png)

## Conclusion

Thanks for reading till the end. Have a Fantastic day !`,
  },
  {
    slug: "recruit-crm-advanced-search-enhancement",
    title: "Recruit CRM - Advanced Search Enhancement",
    subtitle: "Simplifying case-sensitive Boolean search and advanced filters for recruiters.",
    body: `### Introduction

I have made a detailed write up on enhancement of the advanced search filters and the boolean search. As it was the problem statement and the first step I started going through all the features of the Recruit CRM.

### The Initial Findings

I am currently studying ML and AI, I made a fake CSV sheet through python and Faker Libraries. I imported all those in the Recruit CRM to know more on how they do so. In specific they gave me a free trail so I can only add fake profiles to 50 alone with a sample profile called “William”.

The most fascinating part of Recruit CRM is its office blue tone on the whole dashboard which gives me to stay on the page. So far I have seen these recruiting excel sheets and other websites it doesn’t feel the same.

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Recruit CRM - UX Enhancement 1 - Abusyeed/A4_-_1.jpg)

Dashboard comparison with Heatmap based on CTA’s.

When I import those candidate excel sheets in the dashboard, I got a side page to map all the column with Recruiter CRM’s columns, So it made more easy to import only the given and others can be ignored from the excel. Every result which I get is very late although I have a good spec PC and a good internet.

### Understanding Current Advanced Search:

After all profiles were imported, I explored the filters to surface any usability errors. Since the task was to enhance advanced search filters and Boolean search, I conducted a competitive analysis to understand how similar products handle this.

### Competitive Analysis

- Zoho Recruit
- Bullhorn
- Pipedrive
- Manatal
- RecruiterFlow

These are the primary alternatives to Recruit CRM, each with multiple features. Recruit CRM stands out through its distinctive blue-and-green UI. I tested Zoho Recruit using its free version. Manatal is particularly comparable to Recruit CRM, as it also supports an advanced Boolean search with a range-based skill filter.

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Recruit CRM - UX Enhancement 1 - Abusyeed/Flow_chart.png)

Manatal Skill Level Search

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Recruit CRM - UX Enhancement 1 - Abusyeed/Flow_chart2.png)

Recruit CRM Filter search

### Identifying Usability Concerns

Usability encompasses factors such as learnability and efficiency. I analyzed these to optimize the design. To better understand the problem, I first examined why Boolean operators are used in search. The operators AND, OR, and NOT are heavily used in Recruit CRM's advanced search. A key constraint is that OR and NOT must be written in uppercase block letters to function correctly.

![Image](https://downloads.intercomcdn.com/i/o/122973423/def660c263b325ff803c0943/ezgif.com-gif-maker.png)

Image Source: Recruit CRM

In the above image, Recruit CRM claims to support a simplified Boolean syntax by removing brackets and quotes. However, this only works when the operators are written in uppercase. When searching for candidates with diverse technical backgrounds, using OR and NOT in the correct case is essential.

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Recruit CRM - UX Enhancement 1 - Abusyeed/Screenshot_2020-04-02_at_11.55_1.png)

Image Source: Recruit CRM

I ran this test using a free trial with 50 imported candidate profiles.

| Query | Contains Search | Result |
| Canada OR Turkey | No | Result found |
| canada or turkey | Yes | No result found |
| canada OR turkey | No | Result found |

Case-sensitive Boolean expressions create significant confusion for users. I personally experienced this friction on my first attempt. When composing a long Boolean string across multiple columns, even a single lowercase operator silently returns zero results.

### Ideation - Optimizing search

After uploading all candidate profiles, the system should scan each profile and auto-populate filter fields with relevant details. For example, if a company only operates in China, all city and state fields should reflect that automatically. I proposed combining Boolean search with filter-based search into a unified interface, making it easier to locate candidates by selecting options from dropdowns rather than composing raw SQL-style Boolean strings.

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Recruit CRM - UX Enhancement 1 - Abusyeed/A4_-_2.jpg)

Comparing Wireframe and Product

### Wireframe

I created a wireframe prototype of the redesigned advanced search module. As discussed, the case-sensitivity issue significantly impacts efficiency and increases the chance of error. Since the dashboard already has a dedicated Advanced Search placement, the redesign focused on that area.

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Recruit CRM - UX Enhancement 1 - Abusyeed/notionimg2.jpg)

Old Layout - Advanced Search

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Recruit CRM - UX Enhancement 1 - Abusyeed/notionimg.jpg)

Wireframe - Advanced Search

So far I have transformed few CTA’s and added new one’s for better efficiency in search employees, In addition the new one’s are dropdown menus. These (2-5) are termed to be mandatory fields where the recruiters assign them task, if any other than 4 listed dropdown to be searched then Boolean can help them to identify the distinct candidate.

The Boolean search is entirely for distinct skills for example -  “Designer” Not “Web Designer”, “J2EE” OR “SQL”. As the old design has the include search results which makes to see more results based on the search, So it is also indeed in this wireframe too.

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Recruit CRM - UX Enhancement 1 - Abusyeed/A4_-_3.jpg)

Clear Filters - Original

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Recruit CRM - UX Enhancement 1 - Abusyeed/A4_-_4.jpg)

Reset Filters - Wireframe

- **Reset Filters** - Relocated from the bottom action bar to sit adjacent to the Boolean search input, allowing recruiters to quickly clear filters when something goes wrong.

- Location  - This button is defined to specify exact city or office spaces the employees is working. It also has remote or working from home dropdown menu’s which makes user to tap and select their desired option.

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Recruit CRM - UX Enhancement 1 - Abusyeed/Frame_1.jpg)

Hide Fidelity - Advanced Search

- **Gender** - A dropdown populated from the uploaded CSV, listing the gender values of all imported employees.

- **Country** - Lists countries where offices are located, reflecting where employees work based on client arrangements. A radial location search could further enhance this in future iterations.

- **Language** - Lists all candidate languages as a dropdown, allowing recruiters to filter by desired language with a single tap.

- **Save and Search** - Designed without a redundant secondary button to improve accessibility and reduce decision fatigue, making the primary intent clear.

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Recruit CRM - UX Enhancement 1 - Abusyeed/confusion.jpg)

Multiple Colored Action button

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Recruit CRM - UX Enhancement 1 - Abusyeed/confumeme.jpg)

Confusion Meme

As the Hick’s Law states, The time it takes to make a decision increases with the number and complexity Of choices.

- **Search** - The primary action button. It uses the brand's accent color to stand out visually, signaling to users that this will deliver the desired result.

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Recruit CRM - UX Enhancement 1 - Abusyeed/A4_-_5.jpg)

Hide Fidelity - Advanced Search

At last the required columns which has the second priority can be added in the filter search, So that it will make easy to some uncommon test cases. So the task was on the usability enhancement then the aspects such as Learnability, Efficiency, Error prevention, Satisfaction and Memorability can be defined through only by multiple iterations on the design phase by collecting feedback from users. As a fresher, I know the way test design but don’t have potential to do it. These ideation will surely increase in learnability and efficiency also in prevention of errors.

## Conclusion:

The proposed enhancements to Recruit CRM's advanced search feature have been outlined and the core usability concerns addressed. These refinements aim to improve recruiter efficiency and reduce errors caused by case-sensitive Boolean expressions.`,
  },
  {
    slug: "recruit-crm-header-and-navigation-enhancement",
    title: "Recruit CRM - Header & Navigation Enhancement",
    subtitle: "Cleaning up header icons and navigation for better discoverability and accessibility.",
    body: `### Introduction

In this document, I have enhanced the header and adequate icons on all pages of Recruit CRM, which was very clumsy and confusing. I have made this very simple in order to get better accessibility. Problem statement is concise, where as a user I couldn’t find things which I want the more as to do tasks and there are lot of second priority elements occupying space at the first pace.

### Problem Statement

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Recruit CRM - UX Enhancement 2 - Abusyeed/Untitled.jpg)

Maze - Result

To make this more accurate I picked my three known mates to go through my prototype, I used Maze to observe their behavior by some prompts and the results are in the above image. This result has no relation to friendliness bias or any other type, It has been derived only as a generic moderator.

### Initial Findings

As they are stick to website habits that help pages always be with profile dropdown menu, they tried to look there for help, but those are available next to advanced search. It has very low visibility rate, So it can be missed most of the time

It clearly shows that it is difficult to a new person to get at least help from the page exclusively, but there is a global help page and it needs to type down problems. Why would someone try to get sort out their problems globally than if it can be in their page itself.

I have seen many dashboard UI designs in the internet and they have good accent color to showcase aesthetics, I guess Recruit CRM has the same but the icons and the placement of the buttons are little difficult to the new users.

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Recruit CRM - UX Enhancement 2 - Abusyeed/new2.jpg)

Help Icon Usability Issue

There is a misplaced icon in the help videos section. While it contains videos for that specific page, it doesn't resemble any sort of help icon. I updated this in the wireframe for better recognition.

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Recruit CRM - UX Enhancement 2 - Abusyeed/new3.jpg)

Lock Icon Upgrade Warning

This button displays a dialog to upgrade to continue. However, the lock icon creates hesitation for new users to interact with it. It should instead redirect cleanly to the plans page.

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Recruit CRM - UX Enhancement 2 - Abusyeed/new1.jpg)

Redundant Email Icon

Having an email composition option in this location is uncommon since there is a dedicated mailbox page. It has minimal impact on the workflow, as there are better ways to email an employee.

### Ideation - Help Videos

The main concern is the users of Recruit CRM couldn’t access the help pages properly and it can be fixed by placing in a highly visible area, So it can be easily accessible. Every other competitor has distinct flow of work and if any new user switches to new product they will expect few mandatory things to be in certain places such as help pages.

Certainly I have designed a enhanced version of header of Recruit CRM, which has more importance on the usability part to make accessibility to all. Initially, I removed “What’s new”, “Add”, “Compose email” and made something different to meet easy learnability.

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Recruit CRM - UX Enhancement 2 - Abusyeed/taskb11.jpg)

Recruit CRM - Wireframe

I quickly change pages from the side bar, the header seems to be static and all other elements below the header loads according to page. So I only can do minimal changes and I did the placing different locations.

### Wireframe

The new designed wireframe is available at this (Link)

- Help Videos - This button is known to help button with this icon “❔”, It primarily solves users constraints and queries through videos. After action is declared same with side bar videos for that specific page.

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Recruit CRM - UX Enhancement 2 - Abusyeed/45.jpg)

Help Videos - Icon

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Recruit CRM - UX Enhancement 2 - Abusyeed/46.jpg)

Help - Icon

- Column Editor - This button in current design is next to advanced search and it is hidden, It can’t be accessible to new users because it is mixed with lot of buttons. The new placed location gives space to users and actual idea how this button functions.

- Profile - Here, a new item is added “What’s new” which gives updates on recruit CRM when users hit their profile page. Although flash boxes are shown in every update with its version.

- Notification - It is a highly indeed element and it only give all notification about literally everything.

- What’s New - In previous design, this element is placed in the static header as we discussed earlier it does shows updates on the users profile.

At last those elements in header are efficiently transformed, I guess these are the changes to make it clean and visually appealing. The main constraint I personally found was the help videos but I got links from my assessment link. The new users may get diverted or frustrated without knowing how go next, that’s why help videos should be shown more importance.

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Recruit CRM - UX Enhancement 2 - Abusyeed/taskb22.jpg)

What’s New - Wireframe

## Suggestions:

### Icons

The icons which are being used in the side bar are very diverse, such that some are know to be generic icons or some are from other icon family. In addition the icons should be equal, like to be filled icons over all pages but few area it doesn’t has filled icon. These doesn’t come in usability enhancements, but also needs to be changed in perspective of user interface.

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Recruit CRM - UX Enhancement 2 - Abusyeed/A4_-_6.jpg)

Billing Icon - Outline

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Recruit CRM - UX Enhancement 2 - Abusyeed/task_b1.jpg)

Calendar Icon - Outline

### Grid

The changing grid to Kanban view in jobs and contacts page, but the placement of those grid options shouldn’t be in center? I have seen these type of changing grid view in e-commerce website to make shopping faster. This comparison is fully by the design trends which I seen in as a designer.

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Recruit CRM - UX Enhancement 2 - Abusyeed/kanban.jpg)

Grid Options - Recruit CRM

![Image](/gallery/ExportBlock-ac999e04-d396-481e-af51-c4cf8f795c02-Part-1/Case studies/Recruit CRM - UX Enhancement 2 - Abusyeed/ajio1.jpg)

Grid Option - AJIO

### Conclusion

Thanks for reading till the end! so far I have gone through recruit CRM, I have made my suggestions to improvise the overall usability by making a satisfaction to all type of users which is easy and pleasant.`,
  },
]

// ~200 words/min, rounded up so a 1-word blurb never reads "0 min read".
export function estimateReadTime(body: string): string {
  const words = body.trim().split(/\s+/).length
  const minutes = Math.max(1, Math.round(words / 200))
  return `${minutes} min read`
}
