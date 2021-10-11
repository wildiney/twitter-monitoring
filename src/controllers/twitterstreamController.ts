import path from 'path'
import needle from 'needle'
import { Request, Response } from 'express'
import { Socket } from 'socket.io'

require('dotenv').config()
const io = require('../socket')

const TOKEN = process.env.TWITTER_BEARER_TOKEN

const isInExcludedTerms = (stringToEvaluate: string, forbiddenWords: string[]) => {
  if (
    forbiddenWords.some((value) => {
      if (stringToEvaluate.toLowerCase().includes(value.toLowerCase())) {
        console.log('Found:', value, 'in', stringToEvaluate)
      }
      return stringToEvaluate.includes(value)
    })) {
    return true
  }
  return false
}

const fields: string[] = [
  'attachments',
  'author_id',
  'context_annotations',
  'conversation_id',
  'created_at',
  'entities',
  'geo',
  'id',
  'in_reply_to_user_id',
  'lang',
  'possibly_sensitive',
  'public_metrics',
  'referenced_tweets',
  'reply_settings',
  'source',
  'text',
  'withheld'
]
const expansions: string[] = [
  'attachments.poll_ids',
  'attachments.media_keys',
  'author_id',
  'geo.place_id',
  'in_reply_to_user_id',
  'referenced_tweets.id',
  'entities.mentions.username',
  'referenced_tweets.id.author_id'
]
const mediaFields: string[] = [
  'duration_ms',
  'height',
  'media_key',
  'preview_image_url',
  'public_metrics',
  'type',
  'url',
  'width'
]
const placeFields: string[] = [
  'contained_within',
  'country',
  'country_code',
  'full_name',
  'geo',
  'id',
  'name',
  'place_type'
]
const userFields: string[] = [
  'created_at',
  'description',
  'entities',
  'id',
  'location',
  'name',
  'pinned_tweet_id',
  'profile_image_url',
  'protected',
  'public_metrics',
  'url',
  'username',
  'verified',
  'withheld'
]
const rulesURL: string = 'https://api.twitter.com/2/tweets/search/stream/rules'

const streamURL: string = `https://api.twitter.com/2/tweets/search/stream?tweet.fields=${fields.join(',')}&expansions=${expansions.join(',')}&media.fields=${mediaFields.join(',')}&place.fields=${placeFields.join(',')}&user.fields=${userFields.join(',')}`

const excludedTerms: string[] = [
  '@chosopeitudo',
  '@INXXDRA',
  '@uchhshisui',
  '@indra_samantha',
  'abby',
  'anime',
  'Ashura',
  'ashura',
  'armys',
  'aztrikgaming',
  'Bhalavan',
  'colette',
  'chackra',
  'clã',
  'deus',
  'devi',
  'deidades',
  'Neji',
  'Hyuga',
  'encarnações',
  'fortnite',
  'jugador',
  'lexa',
  'itachi',
  'indradlt',
  'indra_fernandz',
  'IndraSilva',
  'Hagoromo',
  'kaguya',
  'luffy',
  'madara',
  'naruto',
  'Naruto',
  'netflix',
  'Ninshu',
  'ninjutsu',
  'niylah',
  'ninja',
  'Nooyi',
  'mccreary',
  'octavia',
  'putra',
  'ramon',
  'raven',
  'rikudou',
  'reencarnação',
  'reencarnacción',
  'sasuke',
  'seiran',
  'shikamaru',
  'shippuden',
  'siempree_indra',
  'tagore',
  'the100brasil',
  'yachi',
  'uchiha',
  'Vritra',
  'yoongi',
  'yoga'
]
interface Research {
  term: string,
  lang: string,
  excludedTerms: string[],
  excludedAccounts: string[]
}
const research: Research[] = [
  {
    term: 'Minsait',
    lang: '',
    excludedTerms: [''],
    excludedAccounts: ['']
  },
  {
    term: 'IndraCompany',
    lang: '',
    excludedTerms: [''],
    excludedAccounts: ['']
  },
  {
    term: 'indra -is:retweet',
    lang: '',
    excludedTerms: [''],
    excludedAccounts: [
      '',
      '__indra09',
      'bs_pedrin',
      'ccoo_indra',
      'chosopeitudo',
      'CrimsonVoidYT',
      'golden_indra',
      'Indr4OP',
      'indra__s99',
      'indra_9717',
      'indra_agusta',
      'indra_alio',
      'indra_fernandz',
      'indra_granados',
      'indra_rangel',
      'indra_samantha',
      'Indra_sour',
      'indradlt',
      'indradeath_',
      'IndraSilva',
      'siempree_indra',
      'sunsetsaso',
      'zorotsuki'
    ]
  }, {
    term: 'Eduardo Almeida',
    lang: '',
    excludedTerms: [''],
    excludedAccounts: ['']
  }, {
    term: 'Fabiana Rosa',
    lang: '',
    excludedTerms: [''],
    excludedAccounts: ['']
  }, {
    term: 'Marcelo Bernardino',
    lang: '',
    excludedTerms: [''],
    excludedAccounts: ['']
  }, {
    term: '(Itaú OR 3169) (caixa OR gerente OR atendente OR Cris OR Crisinha OR Cristiane) -is:retweet',
    lang: 'lang:pt',
    excludedTerms: [''],
    excludedAccounts: ['']
  }, {
    term: 'ESG -is:retweet',
    lang: 'lang:pt',
    excludedTerms: ['guerra'],
    excludedAccounts: ['']
  }
]
const getRules = async () => {
  console.log('getRules')
  const response = await needle('get', rulesURL, {
    headers: {
      Authorization: `Bearer ${TOKEN} `
    }
  })

  console.log(response.body)
  return response.body
}
const rules = research.map((item: Research) => {
  return { value: item.term + ' ' + item.lang + item.excludedTerms.join(' -') + item.excludedAccounts.join(' -from:') }
})
async function setRules () {
  const data = {
    add: rules
  }

  const response = await needle('post', rulesURL, data, {
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${TOKEN} `
    }
  })

  return response.body
}
async function deleteRules (rules: any) {
  if (!Array.isArray(rules.data)) {
    return null
  }

  const ids = rules.data.map(
    (rule: any) => {
      return rule.id
    })

  const data = {
    delete: {
      ids: ids
    }
  }

  const response = await needle('post', rulesURL, data, {
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${TOKEN} `
    }
  })

  return response.body
}
function streamTweets (socket: Socket) {
  const stream = needle.get(streamURL, {
    headers: {
      Authorization: `Bearer ${TOKEN} `
    }
  })
  stream.on('data', (data) => {
    try {
      const json = JSON.parse(data)
      console.log(JSON.stringify(json))
      if (!isInExcludedTerms(json.data.text, excludedTerms)) {
        if (json.data.lang === 'br' || json.data.lang === 'pt' || json.data.lang === 'es') {
          if (json.data.in_reply_to_user_id) {
            console.log('============================================================================================================')
            console.log('In reply to:', json.data.in_reply_to_user_id)
          }
          // console.log(json.data.created_at, '|', json.data.lang.padEnd(3, ' '), '|', json.includes.users[0].location.padEnd(30, ' '), '|', json.data.possibly_sensitive, '|', '@' + json.includes.users[0].username.padEnd(20, ' '), '|', (`https://twitter.com/${json.includes.users[0].username}/status/${json.data.id}`).padEnd(65, ' '), '|', json.data.text)
          socket.emit('tweet', json)
        }
      }
    } catch (error) { }
  })
}

export const monitoramento = (request: Request, response: Response) => {
  io.getIO().on('connection', async () => {
    console.log('Client connected...')
    let currentRules

    try {
      // Get all stream rules
      currentRules = await getRules()

      // Delete all stream rules
      await deleteRules(currentRules)

      // Set Rules based on array above
      await setRules()
    } catch (error) {
      console.log(error)
      process.exit(1)
    }

    streamTweets(io.getIO())
  })

  // response.status(200).json({ bookmarks: null })
  response.sendFile(path.resolve(__dirname, '../', 'public', 'client', 'index.html'))
}
