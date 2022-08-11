const config = require('../config/config');
const axios = require('axios');
const Users = require('../models/user');
const nodeMailer = require('nodemailer');
const cheerio = require('cheerio');
const myEmailAddress = config.myEmailAddress();

let transporter = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: myEmailAddress, 
    pass: 'hepmtlploklfjfeh'
  }
});


const getUsersData = async (req, res) => {
  try {
    return await Users.find();
  } catch(err) {
    console.error(err);
  }  
}

const getNewsData = async (req, res) => {
  try {
    let data = await axios.get('https://www.tasnimnews.com');

    const $ = cheerio.load(data.data);
    let newsTitles = $('article > a > div > .title');
    let newsBody = $('article > a > div > .lead');
    let newsTime = $('article > a > div > time');


    if(!newsTitles || !newsBody || !newsTime) {
      return {
        success: false,
        message: 'news api has some problems!'
      }
    }

    return {
      success: true,
      title: newsTitles[0].children[0].data,
      body: newsBody[0].children[0].data,
      time: newsTime[0].children[1].data,
      readMore: 'https://www.tasnimnews.com/'
    }
    
  } catch(err) {
    console.error(err);
  }
}

let emailSender = (userData, newsData) => {
  for(let user of userData) {
    if(!user) { console.log('no more users'); }
    let mailOptions = {
      from: myEmailAddress,
      to: user.email,
      subject: 'Latest news', 
      html: `<body style="margin:0;padding:0;">
      <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;">
        <tr>
          <td align="center" style="padding:0;">
            <table role="presentation" style="width:602px;border-collapse:collapse;border:1px solid #cccccc;border-spacing:0;text-align:left;">
              <tr>
                <td align="center" style="padding:40px 0 30px 0;background:#70bbd9;">
                  <img src="https://icon-library.com/images/email-icon-for-website/email-icon-for-website-16.jpg" alt="" width="300" style="height:auto;display:block;" />
                </td>
              </tr>
              <tr>
                <td style="padding:36px 30px 42px 30px;">
                  <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
                    <tr>
                      <td style="padding:0 0 36px 0;color:#153643;">
                        <h1 style="font-size:24px;margin:0 0 20px 0;font-family:Arial,sans-serif;">${newsData.title}</h1>
                        <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">${newsData.body}</p>
                        <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">${newsData.time}</p>
                        <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">Read more: ${newsData.readMore}</p>
                        <p style="margin:0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;"><a href="https://josephosan.info" style="color:#ee4c50;text-decoration:underline;">contact</a></p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:30px;background:#ee4c50;">
                  <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;font-size:9px;font-family:Arial,sans-serif;">
                    <tr>
                      <td style="padding:0;width:50%;" align="left">
                        <p style="margin:0;font-size:14px;line-height:16px;font-family:Arial,sans-serif;color:#ffffff;">
                          &reg; joseph<br/>
                        </p>
                      </td>
                      <td style="padding:0;width:50%;" align="right">
                        <table role="presentation" style="border-collapse:collapse;border:0;border-spacing:0;">
                          <tr>
                            <td style="padding:0 0 0 10px;width:38px;">
                              <p style="margin:0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;"><a href="https://josephosan.info" style="color:#11111;text-decoration:underline;">contact</a></p>
                            </td>
                            <td style="padding:0 0 0 10px;width:38px;">
                              <p style="margin:0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;"><a href="https://josephosan.github.io/news-emailer/" style="color:#11111;text-decoration:underline;">unsubscribe</a></p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `
    }

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });
  }
}


const allData = async (req, res) => {
  try {
    let USERS_DATA = await getUsersData(req, res);
    let NEWS_DATA = await getNewsData(req, res);

    emailSender(USERS_DATA, NEWS_DATA);
    res.send('done!');
  } catch(err) {
    console.error(err);
  }
  
}




module.exports = {
  allData
}