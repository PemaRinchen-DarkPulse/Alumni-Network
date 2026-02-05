# Blog Components Visual Guide

## 🎨 Component Structure

```
┌─────────────────────────────────────────────────────────────┐
│  NAVBAR (with new Blog link)                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Alumni Blog                                                 │
│  Share your stories, insights, and experiences...            │
│                                                              │
│  ┌──────────┬──────────┬──────────┐                        │
│  │All Posts │ My Posts │  Drafts  │ ← Tabs                 │
│  └──────────┴──────────┴──────────┘                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  🔍 Search...  |  [All Categories ▼]  | [+ Write a Post]   │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  ┌───────────┐  ┌───────────┐  ┌───────────┐              │
│  │  Card 1   │  │  Card 2   │  │  Card 3   │              │
│  │  Image    │  │  Image    │  │  Image    │              │
│  │ [CAREER]  │  │ [TECH]    │  │[NETWORK]  │              │
│  │ Jan 15    │  │ Jan 20    │  │ Jan 25    │              │
│  │ Title...  │  │ Title...  │  │ Title...  │              │
│  │ Content.. │  │ Content.. │  │ Content.. │              │
│  │ 👤 Author │  │ 👤 Author │  │ 👤 Author │              │
│  │ 👁 245    │  │ 👁 532    │  │ 👁 387    │              │
│  │ #tags     │  │ #tags     │  │ #tags     │              │
│  └───────────┘  └───────────┘  └───────────┘              │
│                                                              │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐              │
│  │  Card 4   │  │  Card 5   │  │  Card 6   │              │
│  └───────────┘  └───────────┘  └───────────┘              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  FOOTER                                                      │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Blog Card Anatomy

```
┌─────────────────────────────────────┐
│                                     │
│         FEATURED IMAGE              │ ← 220px height
│                                     │
├─────────────────────────────────────┤
│ [CATEGORY]            📅 Jan 15     │ ← Badge + Date
├─────────────────────────────────────┤
│                                     │
│  My Journey from College to Tech    │ ← Title (bold, large)
│  Lessons Learned                    │
│                                     │
│  Transitioning from college to the  │ ← Excerpt (3 lines)
│  tech industry was one of the most  │
│  challenging yet rewarding...       │
│                                     │
├─────────────────────────────────────┤
│  👤 Sarah Johnson      👁 245       │ ← Author + Views
├─────────────────────────────────────┤
│  #career  #technology  #beginners   │ ← Tags
└─────────────────────────────────────┘
   ↑ Hover for elevation effect
```

## 🎯 Create Post Modal

```
            Background Overlay (dark)
                    ↓
    ┌───────────────────────────────────┐
    │ Write a New Post           [X]    │ ← Header
    ├───────────────────────────────────┤
    │                                   │
    │ Title *                           │
    │ ┌───────────────────────────────┐ │
    │ │ Enter your post title...      │ │
    │ └───────────────────────────────┘ │
    │                                   │
    │ Category *                        │
    │ ┌───────────────────────────────┐ │
    │ │ CAREER ADVICE           ▼     │ │
    │ └───────────────────────────────┘ │
    │                                   │
    │ Content *                         │
    │ ┌───────────────────────────────┐ │
    │ │                               │ │
    │ │ Share your story...           │ │
    │ │                               │ │
    │ │                               │ │
    │ └───────────────────────────────┘ │
    │                                   │
    │ Tags (comma-separated)            │
    │ ┌───────────────────────────────┐ │
    │ │ career, tech, advice          │ │
    │ └───────────────────────────────┘ │
    │                                   │
    │ Status *                          │
    │ ┌───────────────────────────────┐ │
    │ │ Save as Draft           ▼     │ │
    │ └───────────────────────────────┘ │
    │                                   │
    ├───────────────────────────────────┤
    │         [Cancel]  [Save Draft]    │ ← Actions
    └───────────────────────────────────┘
```

## 🎨 Color Palette

```css
Primary Blue:     #3b82f6  ███ (Buttons, badges, links)
Hover Blue:       #2563eb  ███ (Hover states)
Dark Text:        #1a1a1a  ███ (Headings)
Gray Text:        #6b7280  ███ (Body text, labels)
Light Gray:       #e5e7eb  ███ (Borders)
Background:       #f8f9fa  ███ (Page background)
White:            #ffffff  ███ (Cards, inputs)
```

## ⚡ Interactive States

### Blog Card
```
Default:     Box-shadow: 0 1px 3px rgba(0,0,0,0.1)
             Border-radius: 12px

Hover:       Transform: translateY(-4px)
             Box-shadow: 0 12px 24px rgba(0,0,0,0.15)
             Image scales to 105%
```

### Write Post Button
```
Default:     Background: #3b82f6
             Color: white

Hover:       Background: #2563eb
             Transform: translateY(-1px)

Active:      Transform: translateY(0)
```

### Search Input
```
Default:     Border: 1px solid #e5e7eb

Focus:       Border: 1px solid #3b82f6
             Box-shadow: 0 0 0 3px rgba(59,130,246,0.1)
```

### Tabs
```
Inactive:    Color: #6b7280
             Border-bottom: none

Active:      Color: #3b82f6
             Border-bottom: 2px solid #3b82f6

Hover:       Color: #3b82f6
```

## 📱 Responsive Breakpoints

```
Desktop (1400px+)
┌─────┬─────┬─────┐
│Card │Card │Card │  3 columns
├─────┼─────┼─────┤
│Card │Card │Card │
└─────┴─────┴─────┘

Tablet (768px - 1399px)
┌─────┬─────┐
│Card │Card │  2 columns
├─────┼─────┤
│Card │Card │
└─────┴─────┘

Mobile (< 768px)
┌───────────┐
│   Card    │  1 column
├───────────┤
│   Card    │
├───────────┤
│   Card    │
└───────────┘
```

## 🔤 Typography

```
Page Title:      48px / 2.5rem - Bold (Alumni Blog)
Subtitle:        18px / 1.1rem - Regular (gray)
Card Title:      22px / 1.375rem - Bold (post titles)
Card Excerpt:    15px / 0.95rem - Regular (previews)
Body Text:       16px / 1rem - Regular (most text)
Category Badge:  12px / 0.75rem - Bold, Uppercase
Tags:            14px / 0.875rem - Medium
```

## 🎭 Animation Timing

```
Card Hover:      0.3s ease
Button Hover:    0.3s ease
Border Focus:    0.3s ease
Tab Transition:  0.3s ease
Modal Fade:      0.3s ease
Image Scale:     0.3s ease
```

## 📐 Spacing & Layout

```
Page Padding:        3rem 2rem
Card Padding:        1.5rem
Card Gap:            2rem
Section Margins:     2rem - 2.5rem
Input Padding:       0.875rem 1rem
Button Padding:      0.875rem 1.5rem
Modal Padding:       2rem
Max Page Width:      1400px
Card Image Height:   220px
```

## 🌟 Special Features

### Category Badges
- Blue background (#3b82f6)
- White text
- Uppercase
- Rounded corners (20px)
- Small padding

### Author Avatar
- Circular (32px)
- Gradient background
- User icon centered
- Appears next to name

### View Count
- Eye icon
- Number display
- Gray color
- Aligned right

### Tags
- Hashtag prefix (#)
- Blue color
- Hover effect
- Space-separated

---

**Pro Tip:** All animations and transitions follow the principle of "ease" timing for smooth, natural motion. Hover states provide clear feedback, and the color scheme maintains consistency throughout the interface.
