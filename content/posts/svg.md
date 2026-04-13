+++
title = 'SVG: `viewBox`'
date = 2024-08-26T17:11:59+01:00
draft = false
tags = ["frontend", "html", "svg", "css"]
+++

In this post I'll explore the `viewBox` attribute in `<svg>` html tag. I'll use examples available in the [MDN documentation](https://developer.mozilla.org/en-US/)
but all applied to the SVGs you can find in the home page of this website.

## Introduction

Before getting started, it's worth pointing out that SVGs are a extremely rich feature which deserves a lot of reading. The [documentation mentioned above](https://developer.mozilla.org/en-US/docs/Web/SVG) does an incredible job providing both [Tutorials](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorials/SVG_from_scratch) and [Guides](https://developer.mozilla.org/en-US/docs/Web/SVG/Guides) of all the attributes and features you'll need to create and use SVGs in your frontend applications.

With that said, we can move on into how to display it. 

## Embedding

As SVGs are written in markup, it can easily be mistaken for another html tag, such as `<div>`, `<table>`. This is not quite the case, because SVG code can be embedded in XML, HTML, inside an `<img>` as static content, inside an `<iframe>` or even referenced as as an `<object>`. 

Chosing between these options carries the usual _it depends_ pain. You'll need to consider a couple of pros and cons for each option. I'll just focus between rendering it as an HTML tag vs loading as a static image.

### Static Image

**Pros:**
- Clean html
- Cacheable

**Cons:**
- Limited access:
  - Can't change colors of particular elements (ex. lines, shapes)
  - Can't have full control of elements when performing animations

### HTML Tag

**Pros:**
- Full control
- Easy to debug and understand what's inside it

**Cons:**
- Polluted html
- No cache


As this site requires mirroring, flipping, scaling, and animating the SVGs, I've opted for the HTML tag approach, despite the impact on the HTML file size.


## `viewBox`

If you play around with an SVG, either by copying one from a site like [undraw](https://undraw.co/), [freepik](https://www.freepik.com/) or your favorite icon library, you'll probably notice that it usually comes with a `viewBox` attribute looking something like `viewBox="0 0 500 500"`. 

This is what the documentation says:

> _"The value of the viewBox attribute is a list of four numbers separated by whitespace and/or a comma: min-x, min-y, width, and height"._

I find this explanation confusing for the following reasons:
- `min-x` and `min-y` are coordinates (not lengths)
- `width` and `height` are also available as individual attributes... what gives?!


### Canvas

If you think of a SVG as a canvas, you can think of the values in `viewBox` as top-left and bottom-right points in your canvas window. 

The number doesn't matter much, because as you'll learn, SVG have _Scalable_ in their name. Meaning, the number you define on the coordinates could be a pixel, cm, etc. It'll be defined by other factors (such as `width` or `height` later on). As default, it means a unit matches a pixel in your viewport. 

So, these coordinates, they only matter if the content inside has **it's own** coordinates. Let me give you an example:

```html
<svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="2" width="100%" height="100%" />
  <circle cx="50%" cy="50%" r="4" fill="white" />
</svg>
```

![original](/images/svg/starting-svg.png)

You can see that in the context of the canvas, the rectangle starts 2/10s away from the top and left corner. If I update the `viewBox="2 2 10 10"` you'll see now the rectangle starting at the top of the canvas. If instead you set `viewBox="6 6 10 10"` you see the end of the rectangle and starting point in the middle of it. In conclusion, the 2 first values define the location of the window into what resides inside the canvas. 

![original](/images/svg/centered-svg.png)

![original](/images/svg/shifted-svg.png)


Now let's explore change the second pair of values. Setting `viewBox="0 0 30 30"`. You'll notice that the coordinates don't actually change, instead you zoom. Notice that the zooming is different for the rectangle and for the circle. That is because now the circle has a radius of 2/30 instead of the original 2/10. If you change to `viewBox="6 6 30 30"` the rectangle still closes in the same location.

![original](/images/svg/zoomed-svg.png)

So you actually have 2 different behaviors. If the objects inside the SVG have absolute configurations `r="2"` you'll see a zooming of the canvas. If they don't, there's no change. __Relative means content adapts and absolute means content remains unchanged (window adapts).__

### Fixed dimensions

Now let's see how setting fixed `height` and `width` impacts the changes above.

```html
<svg height="100" width="100" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="2" width="100%" height="100%" />
  <circle cx="50%" cy="50%" r="4" fill="white" />
</svg>
```

![original](/images/svg/scaled-svg.png)


The first thing you'll notice is that the SVG is now tiny. Setting fixed values for the window, mean the default 1 unit to 1px has now changed to 1 unit to 0.1px (10/100). 

Now, if you change the first and second pair you'll see exactly the same behavior as above, only the SVG is _scaled_ to a different dimension. 

### Recipe

Let's say you are working with SVGs on your website. This is the recipe I'd follow:
1. Define the dimensions of the out box via `height` and `width` to set the correct scale for the SVG
2. Adapt the coordinates for the object
3. Scale the inner content inside the canvas (if applicable)


## Conclusion

I hope this clarified some of the doubts you might have had about SVGs. My suggestion for learning how tools like these work is to simply play around with them. The [playground by MDN](https://developer.mozilla.org/en-US/play?uuid=ca097dc9-6900-46a5-a5a4-8d506f18a607&state=1VLLasMwEPyVRRBoIY7VRy6qm0O%2BwxdHVq1NZcnIixUT8u9d2aG99AcCEjO70uwwsFdhqXdCiWqcOpjQpGO4fNZCgoQXudxawKV3fuSuJRpUWaaUdultF2JXvkopS5bW4lB7gCoaTbAMYNl8x4QtWeY8bMOlNdhZ%2BqvLVaoxamdAZ%2FV%2BedDzL43M3hm%2F0DmmySKZu7TK%2FozM%2FsvA52ETFHvg81AZxFboceSFynu1rf0ptDNDznXNBqutyou1%2BciNyURC3biicdh5BRQG7t8WifKBnlQMgZ5XdYvj4JpZAXqH3hQnF%2FT3%2Bp2Nz9mXkazpDVOXrcTtBw%3D%3D&srcPrefix=%2Fen-US%2Fdocs%2FWeb%2FSVG%2FReference%2FAttribute%2FviewBox%2F) is a great place for that.
