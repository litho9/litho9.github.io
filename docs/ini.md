# INI files
3DMigoto uses “.ini” files to describe how mods should be loaded. Note that this does not follow the exact official definition of what an INI file should look like.
Each TextureOverride block in the INI expects a “hash” 32-bit attribute (8 hexadecimal digits) that identifies what is being overriten.

::: tip
The order each block appears in the file doesn't matter.
:::

::: tip
The order each param in a block appears DOES matter. For some configs it ends up behaving the same (Ex.: a `handling=skip` at the end works the same as if in the start of the block), but there's a 'sequentiality' to some params (more on the `drawindexed` topic).
:::

## The `CommandListSkinTexture`
You've maybe seen a line with `run = CommandListSkinTexture` in INI files, and simply added it in all IB blocks, but it's important to understand what it actually does.
The `CommandListSkinTexture` is defined in `.\d3d.ini` for ZZMI and in `.\ZZMI\Core\ZZMI\main.ini` for XXMI. It reads as follows:
```ini
[CommandListSkinTexture]
if $costume_mods
    checktextureoverride = ps-t1
    checktextureoverride = ps-t2
    checktextureoverride = ps-t3
    checktextureoverride = ps-t4
    checktextureoverride = ps-t5
    checktextureoverride = ps-t6
    checktextureoverride = ps-t7
    checktextureoverride = ps-t8
    checktextureoverride = ps-t9
    checktextureoverride = ps-t10
    x140 = 0
endif
```
It can translate to something like "Hey, check if anything is overriten for the hashes currently on these `ps-t` texture slots, and if so replace them".
But why do it this way? Isn't it easier to just specify the texture slots in the IB block?

You see, unlike a game like Genshin, in ZZZ **what texture goes in each slot varies**. Have you ever used a lovely modded coffee shop door, and it only works at daytime? It's because in daytime the model expects the diffuse on the `ps-t2` slot, but at night it expects it in the `ps-t5` slot. To address that, the `checktextureoverride` comes in handy, as you can "TextureOverride" the texture itself (using its hash), and have it replaced in the actual slot it is expected.

```ini
[TextureOverride.MyDiffuse]
hash = 4ecc12a1
this = ResourceMyDiffuse
[ResourceMyDiffuse]
filename = MyDiffuse.dds
```

Although this method solves many problems a mod creator can face, it limits how a mod can be implemented in some aspects. A clear example being the whole FlatNormalMap entangle.

## The FlatNormalMap
In the 1.3 update, ZZZ started using the same hash for every NormalMap texture. Everywhere you check, the hash is always "ebac056e" for 2k textures and "798adba3" for 1k. People trying to use ZZMI probably have faced a problem where the mods appear with strange shadows all over the place (TODO img)

To address that, ZZZ's version of XXMI comes bundled with a default "FlatNormalMap" TextureOverride (you can see it on the end of the `.\ZZMI\Core\ZZMI\main.ini`), It simply overrides all normalMaps with a square gray image, as gray indicates no "bumps" in the normals, making it all "flat".

While this removes the weird shadows, we do lose a bit of quality on the end result. Even if the diffuses can carry a lot of weight on the quality, here's an example of the detail a normalMap adds to a model: TODO

## The `filter_index` approach
There is, alghough, a light in the end of the tunnel. Using texture slots in a dynamic way.
If you use a parameter called `filter_index` in the TextureOverride of a texture, you can "mark" what slot it is being used in.

```ini
[TextureOverride.MyDiffuse]
hash = 4ecc12a1
filter_index = 1234

[TextureOverride.MyIB]
hash = 4b48b731
handling = skip
if ps-t2 == 1234
    ps-t2 = ResourceMyDiffuse
elif ps-t5 == 1234
    ps-t5 = ResourceMyDiffuse
endif
drawindexed = auto

[ResourceMyDiffuse]
filename = MyDiffuse.dds
```

There are, however, some caveats you need to look for when using this method:
* The check is lost after you assign something to the slot. For example, comparing `ps-t2 == 1234` will no longer function if it's after the `ps-t2 = ResourceMyDiffuse`.
* You have to check all the possibles slots a texture can be in. It's almost always only 2 or 3 slots, but you have to know where they are, and that can lead to a lot of testing. On the other hand, the textures tend to come in the same order. If ps-t2 is the diffuse, you can count on ps-t3 to be the NormalMap a ps-t4 to be the MaterialMap*


## Select what parts of a model to render
## restoring original texture slots