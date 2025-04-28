# Glossary

If you've been in the community for some time you might have heard some terms being thrown around, and some newer folks might get some of them confused. This section will try to detail some common tools and concepts.

## 3DMigoto
[3DMigoto](https://github.com/bo3b/3Dmigoto) is an open-source project that intercepts DirectX DLL calls. It was originally created to fix stereoscopic effects in games, but it's so powerful that it's a great fit for running visual mods on the anime games.

3DMigoto serves big purposes:
* A "hunting mode", to visually identify what hash the game uses for each buffer or shader (more on hashes on the INI explanation section)
* Dumping original game data
* And, most important, overriding it all with modded data 

Because it only alters the data that goes in your GPU, it is not considered a cheat. It also has no effect on anything that goes through the connection to the server (no, other people can’t see your mods).

There’s no way to say people using mods are 100% safe from bans, but to this day not a single account was reported to be banned specifically because of mods (About 28 people received one-week suspensions at HSR release for "the use of 3rd party software". Direct cause of it being modding tools is unconfirmed as reports online show many innocent accounts being suspended during that period as well). Therefore, the disclaimers saying there’s a “high risk of being banned” on some "readme"s are highly exaggerated.

## GIMI
[GIMI](https://github.com/SilentNightSound/GI-Model-Importer) (Genshin Impact Model Importer) is a specific configuration of 3DMigoto, as are SRMI, ZZMI, etc. To unify the experience and facilitate managing it all, the people behind these tools created XXMI.

## XXMI
With the [XXMI Launcher](https://github.com/SpectrumQT/XXMI-Launcher), you get a program that downloads XXMI itself. 

::: tip
Note that not only the configurations of XXMI are different, but it also uses a more recent version of 3DMigoto.
:::

## XXMI-Tools
[XXMI-Tools](https://github.com/leotorrez/XXMITools) is a Blender addon to import and export models for XXMI’s formats.