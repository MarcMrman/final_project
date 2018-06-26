# 07-06-2018

## Done:
- filtered data for missing values in essential data
- made bar chart
- made scatter plot
- made update function for scatter when clicked on bar
- colored bar chart, i colored it depending on amount of findings per year to better clarify the differences. 
- implemented navigation bar, this way it seems like a real webpage. Also not all the text and graphs are together, which makes te website more user friendly. 

## To do:
- fix ticks on x-axis bar chart
- think of what to do with outliers scatter plot
- gather needed data in usable datastructure for area diagram and finish it (started already)
- link area diagram with scatter plot
- color scatters in scatter plot

## Problems:
- thinking of what way is easy to gather relevant data per year for methods usage

# 08-06-2018

## Done:
- created a button

## To do:
- Transition scatters when updated
- find variables for size of scatters and colors.
- link button to update function y axis

## Problems:
- Linking button to function to update one axis. Might have to update both the axis, not just the y axis. Look if axis can get id's

# 11-06-2018

## Done:
- Started working on polar area diagram
- started y axis info update, using "planet" for tipic to make the code use ["angular_distance"] instead of ["star_distance"]

## To do:


## Problems:
- linking data to my polar area diagram. 
- i am not sure if the way my scatter plot function is made now i can seperately update my y-axis. 
- draw scatters reads planetsyear[i] as [object object]

# 12-06-2018
## Done:
- axis updating per year for scatter plot
- graph update on different subject
- coloured scatters on eccentricity, sized them on radius (if available)

## To do:
- thinking of what to do with outliers on scatter plot
- put titles on scatter plots

## Problems: 
- outliers in data make the axis disporportianate
- clicking of different years when swithced from topic

# 13-06-2018
## Done:
- title to scatter plot
- button for highlighting planets
- started with legend for scatter plot

## To do:
- buttons ipv checkbox

## Problems:
- checkbox/radio don't respond on onclick, only to onchange = "changeFunction". So can't put data throug it. 

# 14-06-2018
## Done:
- legend in scatter plot
- made polar area diagram w/ interactivity

## To do:

## Problems: 

# 15-06-2018
## Done:
- parsed years on x axis bar chart
- logarithmic scales for both axis of scatter plot to deal with outliers
- created opacity for scatters to be able to see all scatters when there are a lot close to eachother
- resized polar diagram, looking to fit all visualizations in one page wihtout scrolling
- put code and scripts in seperate folders on github

## To do:
- put container divs in css grid systeem to be able to control layout of html better
- fix navigation bar in representation.html

## Problems:
- navigation bar act weird
- positioning dropdown menu
- fitting all visualizations in a page without scrolling

# 18-06-2018
## Done:
- navigation bar made new to fix problem
- tracking dropdown menu choice
- html layout
- add explanation on representation page
- made most variables global for accesiblity in different files/functions

## To do:
- storytelling
- try to link area diagram to scatter plot

## Problems:
- linking area diagram to scatter (mouseenter), fixed by showing method of detection in tooltip in scatter plots

# 19-06-2018
## Done:
- Ticks x axis, scaling bar chart
- mouseenter on area diagram, works for all methods now

## To do:
- fix mouseenter
- remove update scatters, obsolete now due to global variables

## Problem:
- detection types with spaces in between does not get seen

# 20-06-2019
## Done: 
- deleting obsolete updating functions
- had infinity errors, turned out still observations were there without angular distance.
- transition and mouseover work together now

## To do:

## Problems:
- transition and mouseover etc do not work together

# 21-06-2018
## Done:
-

## To do:
- fix mouseleave function. either with code or by not sizing scatters by radius. also radius is missing often in data. 

## Problems:
- mouseenter selects right scatters, but colours it back with the wrong planet charactersitics sometimes

# 22-06-2018
## Done: 
- make scalable axis round up with .nice() for nicer visualization
- variable minimal values scatter plot axis
- link to new tab for data source

# 25-06-2018
## Done:
- fixed hovering problem. all planets are coloured back according to correct characteristics. now fill up an empty list with planets hovered over, when mouseleave code iterates back over the list. 
- made colors color blind friendly
- started documentation, readme, report, proposal etc.
- added a license
- story page

## To do:

## Problems:
- when looking for minimum value for scatterplot axis using d3.min() the scaling brakes down for two complete years.

# 26-06-2018
## Done:
- made reports
- read rubric to check own code before checking each others code

## To do:
- make demo

## Problems:

