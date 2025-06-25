# TCS Improved Mod Page
Official releases hosted on [Civfanatics](https://forums.civfanatics.com/resources/tcs-improved-mod-page.32024/).

## Description
Various improvements to the Mod page. This includes:
* Separating official and fan content into different scrollable lists
* Show hidden and locked content
* Reducing wasted space
* Added support for several custom Properties
* Added iconography to aid in status readability
* Added buttons to Enable/Disable All for each category.

**Note:** These buttons will not toggle locked content or the TCS Improved Mod Page mod.

## Installation
### Recommended
It is recommended to use the [CivMods](https://civmods.com/install?modCfId=32024) manager.
### Manual
Extract to your Mods folder.
* **Windows:** %localappdata%\Firaxis Games\Sid Meier's Civilization VII\Mods
* **MacOS:** ~/Library/Application Support/Civilization VII/Mods
* **Linux:** ~/My Games/Sid Meier's Civilization VII/Mods/
* **Steam Deck:** ~/My Games/Sid Meier's Civilization VII/Mods/
Mods are enabled by default after installation.

**Note:** Please ensure mods are not nested inside an extra folder after extracting - if they are they will not work!

## Localization
If you would like to contribute a translation, please do one of the following:
* open an issue with the **localization** label and upload your files there, OR
* open a branch from the current version, add your localization to an appropriate folder, and create a Pull Request.

## Custom Properties
To support custom Properties simply add them to the Properties tag within your .modinfo file. The following custom Properties are currently supported:
* SpecialThanks
* Version
* Compatibility
* URL
 * **Note:** this property can be clicked on in the Mod screen to copy the URL to your clipboard.

Here is an example:
```
<Properties>
  <Name>LOC_MOD_TCS_IMPROVED_MOD_PAGE_NAME</Name>
  <Description>LOC_MOD_TCS_IMPROVED_MOD_PAGE_DESCRIPTION</Description>
  <Authors>LOC_MOD_TCS_IMPROVED_MOD_PAGE_AUTHORS</Authors>
  <SpecialThanks>LOC_MOD_TCS_IMPROVED_MOD_PAGE_THANKS</SpecialThanks>
  <Compatibility>LOC_MOD_TCS_IMPROVED_MOD_PAGE_COMPATIBILITY</Compatibility>
  <URL>LOC_MOD_TCS_IMPROVED_MOD_PAGE_URL</URL>
  <Package>Mod</Package>
  <AffectsSavedGames>0</AffectsSavedGames>
  <Version>2</Version>
</Properties>
```
## Screenshots
### With Mod
![image](https://github.com/user-attachments/assets/4ba1a421-fc3a-4972-b55b-5f14698e75a1)
### Without Mod 
![1741207088663](https://github.com/user-attachments/assets/969955f5-f36b-4402-bbcb-e78d0eaba26d)
