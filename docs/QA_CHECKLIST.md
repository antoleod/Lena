# QA Checklist

## Build

- `npm run build` passes

## Onboarding

- language selection works
- name can be entered with keyboard
- enter submits the name step
- onboarding finishes and lands on home

## Navigation

- home loads after onboarding
- map loads
- world page loads
- mission page loads
- activity page loads
- shop, history and settings load

## Progress

- finishing an activity saves activity progress
- finishing a level saves level progress
- question repetition updates question states
- refresh keeps profile, progress and rewards

## Mission flow

- levels 1-8 behave as normal practice
- level 9 works as mission challenge
- level 10 works as mission exam
- end of mission shows reward state

## Responsive

Test at minimum:

- small mobile
- large mobile
- iPad 11"
- desktop

Check:

- no overlap
- no broken buttons
- no hidden primary CTA

## I18n

Verify UI in:

- French
- Dutch
- English
- Spanish

Check:

- onboarding
- home
- map
- activity
- history
- shop
- settings

## Content

- every visible module opens real activity content
- no dead activity links
- language modules with visual vocabulary show image support
- multiplication tables 2-20 are reachable
