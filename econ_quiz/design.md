This file shows both the general design rules that make creating a website easier, as well as personal design choices, all in one. It also includes some websites that are used as inspiration.

# Design

## Website personality: Playful/Fun
- colorful and round design
- hand-drawn icons or illustrations
- animations
- fun language

## Typography
### general rules
- sans-serif
- Poppins
- normal text: between 16px and 32px font-size
- long text: 20px+
- headlines: 50px+; 600+ font-weight
- not below 400 font-weight
- less than 75 characters per line
- normal text: 1.5-2 line-height
- smaller and longer text: larger line-height
- bigger text: below 1.5 line-height
- smaller letter-spacing in headlines if it looks unnatural
- all caps for short titles, combined with small font-size, bold font-weight and increased letter-spacing
- never justify text
- don't center long text blocks (small blocks are fine though)

### spacing system
2 / 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 80 / 96 / 128

### font size system
10 / 12 / 14 / 16 / 18 / 20 / 24 / 30 / 36 / 44 / 52 / 62 / 74 / 86 / 98

## Colors
### general rules
- red -> draws attention; power, passion, excitement -> will not be used
- **orange** -> less aggressive than red; happiness, cheerfulness, creativity -> **will be used**
- *yellow* -> joy, brightness, intelligence -> *probably not*
- *green* -> harmony, nature, growth, health -> maybe for the study component, *probably not*
- blue -> peace, trustworthiness, professionalism -> will not be used
- purple -> wealth, wisdom, magic -> will not be used
- pink -> romance, care, affection -> will not be used
- brown -> nature, durability, comfort -> will not be used
- black -> power, elegance, minimalism, grief, sorrow -> will not be used
- colors are used to draw attention to the most important elements on the page, add interesting accents, or make entire components or sections stand out
- colors can be used strategically in images and illustrations
- on dark colored backgrounds, try to use a tint of the background for text
- text should usually not be completely black
- don't make text too light (contrast ratio needs to be at least 4.5:1 for normal text and 3:1 for large text(18px+))
### Brand color
- main: #ffa500
- shades: #e69500, #cc8400, #b37300, #996300, #805300, #664200, #4d3100, #332100, #191000
- tints: #ffae1a, #ffb733, #ffc04d, #ffc966, #ffd280, #ffdb99, #ffe4b3, #ffedcc, #fff6e6

### Gray color
- main: #808080
- shades: #737373, #666666, #5a5a5a, #4d4d4d, #404040, #333333, #262626, #1a1a1a, #0d0d0d
-tints: #8d8d8d, #999999, #a6a6a6, #b3b3b3, #c0c0c0, #cccccc, #d9d9d9, #e6e6e6, #f2f2f2

## Images and illustrations
### general rules
- different types of images: product photos, storytelling photos, illustrations, patterns
- images should support the website's message and story
- original images, or original-looking stock images (e.g. from Unsplash) should be used
- showing real people is better
- cropping images can be a good idea
combining photos, illustrations and patterns can be done
- text on images can be handled by darkening or brightening an image, completely or partially, using a gradient; by positioning text into neutral image area; by putting text into a box
- to account for high-res screens, make image dimensions 2x as big as their displayed size; scale factor is actual pixels the screen contains divided by pixels represented on screen, and can be 2x or even 3x on high-res screens
- compress images for a lower file size and better performance
- when using multiple images side-by-side, they should have the same dimensions

## Icons
### general rules
- should use a good icon pack, such as phosphor icons, ionicons, heroicons, or icons8
- icon packs should not be mixed
- only use SVG icons or icon fonts (not bitmap image formats)
- adjust to website personality; roundness, weight and filled/outline depend on typography
- use to provide visual assistance to text, or for product feature blocks
- use icons associated with actions and label them (unless 100% clear)
- consistency is important
- use icons as bullet points
- to keep icons neutral, use same color as text; to draw more attention, use different color
- icons have to make sense and fit the text or action
- icons should not be larger than what they were designed for; if needed can be enclosed in a shape

## Shadows
### general rules
- shadow creates depth (3D); the more shadow, the further away from the interface the element is
- don't have to be used; only used if it makes sense for the website personality
- should be used in small doses(not added to every element)
- should be light, not too dark
- small shadows for smaller elements that should stand out
- medium-sized shadows for larger areas that should stand out a bit more
- large shadows for elements that should really float above the interface
- can be changed on mouse interaction (click and hover)
- glows can be used instead of regular shadows (glows = colored shadows)

## Border-radius
### general rules
- used to increase the playfulness and fun of the design and making it less serious
- typefaces (font families) have a certain roundness; border-radius should match that roundness
- use border-radius on buttons, images, around icons, standout sections and other elements

## Whitespace
### general rules
- in right amount makes design appear clean, modern and polished
- communicates how different pieces of information are related to one another
- implies invisible relationships between the elements of a layout
- use tons of whitespace between sections
- use a lot of whitespace between groups of elements
- use whitespace between elements
- inside groups of elements, try to use whitespace instead of lines
- the law of proximity: the more some elements (or groups of elements) belong together, the closer they should be
- better to start with a lot of whitespace, and then remove some of it later
- should match other design choices; e.x. if we have big text or big icons, we need more whitespace

### whitespace system
2 / 4 / 8 / 12 / 16 / 24 / 48 / 64 / 80 / 96 / 128

## Visual hierarchy
### general rules
- all about establishing which elements of a design are the most important ones; drawing attention to the most important elements; about defining a path for users, to guide them through the page
- we use a combination of position, size, colors, spacing, borders, and shadows to establish a meaningful visual hierarchy between elements/components
- position important elements closer to the top of the page
- images draw a lot of attention, so they should be used mindfully (larger images get more attention)
- whitespace creates separation, so it should be used strategically to emphasize elements
- for text elements, use font-size, font-weight, color, and whitespace to convey importance
- we should emphasize titles, sub-titles, links, buttons, data points and icons; de-emphasize less important text, like labels or secondary/additional information
- emphasize an important component using background color, shadow, or border (or multiple)
- we can emphasize component A over component B by de-emphasizing component B
- components to emphasize: testimonials, cta sections, highlight sections, preview cards, forms, pricing tables, important rows-columns in tables, etc.

## UX design
### what it is
- UI = what it looks and feels like; UX = how it works
- UI design makes an interface beautiful; UX makes it useful and functional
- UX design can not exist without UI design

### general rules
- a website or application exists for a reason; a user has a goal for visiting it, and a business has a goal for creating it; good UX design aligns the user's goals with the business' goals
- don't design complicated layouts; use patterns that users know; user familiarity with the layout is always more important than being original
- cta should be the most prominent element, text should be descriptive
- use blue text and underlined text only for links
- animations should have a purpose and be fast: between 200 and 500 ms
- in forms, align labels and fields in a single vertical line to make the form easier to scan
- offer users good feedback for all actions: form errors, form success, etc.
- place action buttons where they will create an effect (law of locality)
- use descriptive, keyword-focused headline on the main page; don't be vague or fancy
- only include relevant information, efficiently; cut out fluff and make the content 100% clear
- use simple words; avoid technical jargon and 'smart-sounding' words
- break up long text with sub-headings, images, block quotes, bullet points, etc.

## Elements and components
### general rules
- start with elements, connect them into components, connect those into layouts, then form a webpage
- use common elements and components to convey your website's information
- combine components into layouts using common layout patterns
- assemble different layout areas into a complete, final page

### elements
- text
- buttons
- images
- input elements
- tags

### components
- breadcrumbs
- pagination
- alert and status backgrounds
- statistics
- gallery
- feature box
- preview and profile cards
- accordion
- tables
- carousel
- customer testimonials
- customer logos
- featured-in logos
- steps
- forms
- tables
- pricing tables
- modal windows

### section components
- navigation
- hero section
- footer
- cta
- feature row

### layout patterns
- row of boxes or cards
- grid of boxes or cards
- z-pattern
- f-pattern
- single-column
- sidebar
- multi-column/magazine
- asymmetry/experimental

# Websites for inspiration:
1. https://land-book.com/websites/70894-koffiracha-hot-sauce
2. https://quizizz.com/?lng=en
3. https://www.buzzfeed.com/quizzes
4. https://www.sporcle.com/
5. https://land-book.com/websites/70199-cassandre-levrard-cassandre-levrard
6. https://land-book.com/websites/69514-gentlerain
7. https://land-book.com/websites/67904-403-forbidden
8. https://onepagelove.com/inflatable-vol-2
9. https://onepagelove.com/barry-the-truck
10. https://onepagelove.com/arc-for-windows
11. https://onepagelove.com/jive
12. https://onepagelove.com/bitesized
13. https://onepagelove.com/flexboom
14. https://onepagelove.com/bloobies
15. https://onepagelove.com/space-3d-illustrations
16. https://www.awwwards.com/sites/analogue
17. https://www.awwwards.com/sites/nod-coding-bootcamp
18. https://www.awwwards.com/sites/otsea
19. https://www.awwwards.com/sites/treasures-of-japan
20. https://www.awwwards.com/sites/porter-robinson-smile-d
21. https://www.awwwards.com/sites/rspca-animal-futures
22. https://www.awwwards.com/sites/popin
23. https://www.awwwards.com/sites/hatom
24. https://www.awwwards.com/sites/makemeplay
25. https://www.awwwards.com/sites/dogelon-mars
