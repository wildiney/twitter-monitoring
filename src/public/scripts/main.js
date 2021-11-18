/* eslint-disable no-undef */
const tweetStream = document.getElementById('tweetStream')
// eslint-disable-next-line no-undef
const socket = io()
socket.on('connect', () => {
  console.log('Connected to server')
})

socket.on('tweet', (tweet) => {
  console.log(tweet)
  let image = ''
  // console.log(tweet)
  const tweetData = {
    id: tweet.data.id,
    created_at: new Date(tweet.data.created_at).toLocaleDateString('pt-br', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    }),
    name: tweet.includes.users[0].name,
    lang: (tweet.data.lang === 'pt') ? 'br' : (tweet.data.lang === 'en') ? 'us' : tweet.data.lang,
    location: tweet.includes.users[0].location,
    sensitive: tweet.data.possibly_sensitive,
    text: tweet.data.text,
    username: `${tweet.includes.users[0].username}`,
    profile_pic: `${tweet.includes.users[0].profile_image_url}`
  }
  try {
    tweetData.image = tweet.includes.media[0].url
    tweetData.type = tweet.includes.media[0].type
  } catch (error) {

  }
  try {
    if (tweetData.image !== undefined) {
      image = `
                    <div class='news'>
                        <img src='${tweetData.image}' />
                    </div>`
    }
  } catch (error) {
    console.log(error)
  }

  notifyit('New tweet', tweetData.text)

  const tweetEl = document.createElement('div')
  tweetEl.className = 'tweet'
  tweetEl.innerHTML = `
                <header>
                    <div>
                        <a href='https://twitter.com/${tweetData.username}'>
                            <img src='${tweetData.profile_pic}'/>
                        </a>
                    </div>
                    <div>
                        <p>
                          <a href='https://twitter.com/${tweetData.username}'>
                            <span class='username'>${tweetData.name}</span></a> 
                            <small>@${tweetData.username}</small>
                        </p>
                        <p>${tweetData.created_at} - ${tweetData.sensitive}</p>
                        <p>${tweetData.location}</p>
                    </div>
                    <div>
                    
                        <img src="https://flagcdn.com/64x48/${tweetData.lang}.png" srcset="https://flagcdn.com/128x96/${tweetData.lang}.png 2x, https://flagcdn.com/192x144/${tweetData.lang}.png 3x"  width="64" alt="${tweetData.lang}" />
                    </div>
                </header>
                ${image}
                <div class='tweet_text'>
                    <a target="_blank" href="https://twitter.com/${tweetData.username}/status/${tweetData.id}">
                        ${tweetData.text}
                    </a>
                </div>    
            `
  tweetStream.prepend(tweetEl)

  // setTimeout(() => tweetEl.remove(), 5000)
})

function notifyit (title, text) {
  if (!window.Notification) {
    console.log('Browser does not support notifications')
  } else {
    if (Notification.permission === 'granted') {
      const notify = new Notification(title, {
        body: text
      })
      console.log(notify)
    } else {
      Notification.requestPermission().then((p) => {
        if (p === 'granted') {
          const notify = new window.Notification(title, {
            body: text
          })
          console.log(notify)
        } else {
          console.log('User blocked notifications')
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
