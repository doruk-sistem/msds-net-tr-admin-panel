import { ServerComponentProps } from 'payload'

const text = {
  title: {
    tr: 'API Anahtarı',
    en: 'API Key',
  },
  description: {
    tr: 'API Anahtarı, kullanıcıya özel olarak atanan bir erişim anahtarıdır.',
    en: 'API key is an access key that is unique to the user',
  },
  description2: {
    tr: 'Sistem tarafından otomatik olaran atanır.',
    en: 'The system generate it automatically.',
  },
  description3: {
    tr: 'API KEY Tikini lütfen kaldırmayınız. Bu anahtarı kimseyle paylaşmayın.',
    en: 'Please do not remove the API KEY tick. Do not share this key with anybody.',
  },
}

export default function Description({ operation, i18n: { language: lang } }: ServerComponentProps) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <div>
        <h3>{text.title[lang]}</h3>
        <p>
          {text.description[lang]}{' '}
          {operation === 'create' ? text.description2[lang] : text.description3[lang]}
        </p>
      </div>
    </div>
  )
}
