import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Modding Docs",
  description: "Some insights on modding certain anime games.",
  head: [['link', { rel: 'icon', href: './assets/favicon.png' }]],
  themeConfig: {
    logo: './assets/favicon.png',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'INI Docs', link: '/ini/ini-basics' }
    ],

    sidebar: [
      {
        text: 'General',
        collapsible: true,
        items: [
          { text: 'Glossary', link: '/glossary' },
          { text: 'IB-VB', link: '/ib-vb' }
        ]
      },
      {
        text: 'INI',
        collapsible: true,
        items: [
          { text: 'INI basics', link: '/ini/ini-basics' },
          { text: 'Texture Slots', link: '/ini/beyond-texture-slots' }
        ]
      },
      {
        text: 'Scripts',
        collapsible: true,
        items: [
          { text: 'ZZZ Character Export', link: '/scripts/zzz-char-export' },
        ]
      }
    ],

    socialLinks: [
      { icon: { svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"36\" height=\"36\" viewBox=\"0 0 36 36\"><image x=\"2\" y=\"3\" width=\"31\" height=\"30\" xlink:href=\"data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAeCAYAAADU8sWcAAAC1ElEQVRIibWXW4iNURTHfwcjEfEw7kpjaGhyK6XESC4PCCOXSMoDDbklb9IoZQaFko4GBxGSPAyNSCka8qIONTIYI6ZIyeSSGLTqf6bd9l3OOXPm//Lttb/9rf/ae+393+tLJJMpugGjgHKgIcp1j+5gBqqBM3GDeuXpvBgYDfSX/RV4A3wEpgAbsnGSC/l0YAkwRwRF3vvvwD5gp4KIDSAb8hlaxrkx4/oCtWpvAW7GOY7LeRJ4kAWxj6NAfVfIbwCbciQ1/FVKFgHb4siHACO8/gPAwjyITwDvgD+yj+nYhZLX6YOXwG71r8iDuAbYAVwHfjj9dVHkB9Ueo3ab93G2GAb8Ah4D/ZxvFgBTw8htQ5UCx4G08lXujLkHPHfsn3q2AHu01Ib1OmLLA3jO6Wk8u1xywytgKzAJOK9Nk4EFNB6YLfs2sBnYLhVzx5r4LAsgHw4MAu4Dh4GhhOz2SiDh2GXAYi2poQJ4BixVYE8DfPiockm1yQNFxg9oHvAC6JA9QHujXilq1ewTAb4y2A+Mdez3YTP3AzKnq7TMGUyTnM7XrKKI8YivAJ+CiHCW10WxZ/cEjgDtWolsYSlanRkbNPMPIY7S0gMXuRA36+LpVL0g8uaAvluKuCoiuDjY6l2W6pWEkb/17CaRNuqCqcmTfKCT5rVh5C1Ou00an9LHZcpzV1EZRt6kZ6sEo9oRmCJPVPLFZKuEgnZ7WgRfgL3e7daonV4IrAwib5cMzgImOv0pSW9kRZoDxoUVExc8+zVwEjit268Q6BNGnpKCZTASeATMLBCx4WJYAflbs98ou3eBCJ8odSbHDVE13NkCEX5z2p9VXJo0R5bOD5XrkhyIOqQTpU5frU5JhdLZibjSeZ1nW513yLGvKTg7HQbbJxOc6sZgldJdHVtXwGJ/Gixi+0Ox3A8GTgGXgDvS6qu6Be1YrpFAmW0/DVbzWy1oAf8P4B+yBZGjwleIiwAAAABJRU5ErkJggg==\"/></svg>" }, link: 'https://lioh.fanbox.cc/' },
      { icon: { svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"36\" height=\"36\" viewBox=\"0 0 36 36\"><image x=\"3\" y=\"2\" width=\"30\" height=\"32\" xlink:href=\"data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAgCAYAAAAFQMh/AAAAhklEQVRIie2XwQ6AIAhAofn/Z299qm1ubcngQEFY8o4exKeIiLXuYEQTpkFucLOKqiUDPwGF82zc+S+x1YN5mHEJiNmtf2EsVS6WLCAZ2A2LrFZl88mnjG8ZUkKNTQy0LPU69S4lK9drlEtn6J3dQwc6RVZ7mc/1d+LuMV2hdgdYQ0qMMQAcf24PHozWsWsAAAAASUVORK5CYII=\"/><image x=\"3\" y=\"2\" width=\"30\" height=\"32\" xlink:href=\"data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAgCAYAAAAFQMh/AAABKUlEQVRIie2XMQ6CMBSGf4xhMe4mDk7eAAZvQIyn8ZqYOLk6OBgP4KImYmr6kvIotIVXXPwSItLaj799kpIUxQ5CVC3DJLaLEymrwUsfnUiLlXChj065tPjp23EqKKW1vANIjbEr1i4uJmY+nWKIiQ2AB4A5gCVPHlOspEd9rmppbzbGFHNy/b0EkMX4H9t482uSiWkNtwBurs4xpvoE4OLqNNZU/8W/E0sUF1WzelJdxxQTV59qHiLmO42gpEPEnKCkprhtr9RGr4Q2cSi9EnaJV0MHc1Dq5pyLIZHEQUbN5gMkjSytYZvq5wjJv2La/VF1r4UdtbU1xRyzyM76s7GDCCTj3U0xT6448DsNSEhYfx9rs9dI6CPmb3c8gQuvGfJJ7Lz7YAB8ACVaLL6ifPaYAAAAAElFTkSuQmCC\"/></svg>" }, link: 'https://gamebanana.com/members/2565587' },
      { icon: 'github', link: 'https://github.com/litho9' }
    ]
  }
})
