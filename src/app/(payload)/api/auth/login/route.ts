import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import authHelper from '@/utilities/authHelper'
import getPayloadCMS from '@/utilities/getPayloadCMS'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email && !password) {
      return NextResponse.json({ error: { message: 'Invalid payload' } }, { status: 400 })
    }

    const payload = await getPayloadCMS()

    const users = await payload.find({
      depth: 1,
      collection: 'companyUsers',
      where: {
        email: {
          equals: email,
        },
      },
    })

    if (!users?.docs || users.docs.length === 0) {
      return NextResponse.json({ error: { message: 'Invalid credentials' } }, { status: 401 })
    }

    // Kullanıcılar arasından şifresi doğru olanı bul
    let validUser: any = null
    let isValid = false

    for (const user of users.docs) {
      const userPasswordValid =
        password && user.hashedPassword
          ? await bcrypt.compare(password, user.hashedPassword)
          : false

      if (userPasswordValid) {
        validUser = user
        isValid = true
        break
      }
    }

    if (!isValid || !validUser) {
      return NextResponse.json({ error: { message: 'Invalid password' } }, { status: 401 })
    }

    // Eğer kullanıcı birden fazla şirkete kayıtlıysa, şirket seçimi için özel response döndür
    if (users.docs.length > 1) {
      const userCompanies = users.docs.map((user) => ({
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        company: user.company,
        registrationCompleted: user.registrationCompleted,
      }))

      return NextResponse.json(
        {
          requiresCompanySelection: true,
          userCompanies,
          message: 'Please select a company to continue',
        },
        { status: 200 },
      )
    }

    // Tek şirkete kayıtlı kullanıcı için direkt giriş yap
    // registrationCompleted kontrolü kaldırıldı - kullanıcı şifre ile giriş yapabilir
    const { accessToken, refreshToken } = await authHelper.encrypt({
      userId: validUser.id,
    })

    delete validUser.hashedPassword
    delete validUser.apiKey

    return NextResponse.json(
      {
        accessToken,
        refreshToken,
      },
      {
        status: 200,
        headers: {
          'Set-Cookie': [
            `token=${accessToken}; Path=/; HttpOnly; SameSite=Strict`,
            `refreshToken=${refreshToken}; Path=/; HttpOnly; SameSite=Strict`,
          ].join(', '),
        },
      },
    )
  } catch (error) {
    console.error('LOGIN ERROR: ', error)

    return NextResponse.json(
      {
        error: {
          message: 'Internal server error',
        },
      },
      { status: 500 },
    )
  }
}
