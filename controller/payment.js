import axios from 'axios';
import db from '../model/index.js';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const { Payment, User } = db;

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE, //  사용 할 이메일 서비스명 / 예) gmail, naver
  host: process.env.EMAIL_HOST, // SMTP 서버명
  port: process.env.EMAIL_PORT, // SMTP 포트 번호
  secure: false,
  auth: {
    user: process.env.EMAIL_ID, // 사용 할 이메일 아이디
    pass: process.env.EMAIL_PASSWORD, // 발급하여 저장한 비밀번호
  },
  debug: true,
});

const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY;
const JWT_ACCESS_SECRET_KEY = process.env.JWT_ACCESS_SECRET;

export const verifyPayment = async (req, res) => {
  try {
    const { userId, paymentKey, orderId, amount } = req.body;
    const findUser = await User.findOne({ where: { id: userId } });
    if (!findUser) return res.json({ result: false, message: '가입된 회원이 아니거나 탈퇴한 회원입니다.' });

    let response;
    try {
      response = await axios.post(
        'https://api.tosspayments.com/v1/payments/confirm',
        {
          paymentKey: paymentKey,
          orderId: orderId,
          amount: amount,
        },
        {
          headers: {
            Authorization: `Basic ${Buffer.from(TOSS_SECRET_KEY + ':').toString('base64')}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (axiosError) {
      console.error('결제 확인 요청 실패:', axiosError.response?.data || axiosError.message);
      return res.status(400).json({
        result: false,
        message: '결제 확인 요청에 실패했습니다.',
        error: axiosError.response?.data || axiosError.message,
      });
    }
    const paymentData = {
      paymentKey: paymentKey,
      paymentPrice: amount,
      paymentStatus: 'COMPLETED',
      paymentMethod: response.data.method || 'UNKNOWN',
      userId: findUser.id,
      orderId: response.data.orderId,
      cardNumber: response.data.card ? response.data.card.number : 'UNKNOWN',
      cardType: response.data.card ? response.data.card.cardType : 'UNKNOWN',
      suppliedPrice: response.data.suppliedAmount,
      vat: response.data.vat,
    };

    // console.log('🚀 ~ verifyPayment ~ response:', response);

    // 🚀 ~ verifyPayment ~ response: {
    //   status: 200,
    //   statusText: 'OK',
    //   headers: Object [AxiosHeaders] {
    //     date: 'Thu, 26 Jun 2025 10:49:06 GMT',
    //     'content-type': 'application/json',
    //     'transfer-encoding': 'chunked',
    //     connection: 'keep-alive',
    //     vary: 'Origin,Access-Control-Request-Method,Access-Control-Request-Headers,origin,access-control-request-method,access-control-request-headers,accept-encoding',
    //     'x-tosspayments-trace-id': 'afbc9b43d8f9c55f1201d777b6e68418',
    //     'access-control-allow-credentials': 'true',
    //     'access-control-allow-methods': 'POST, GET, OPTIONS, DELETE',
    //     'access-control-max-age': '3600',
    //     'access-control-allow-headers': 'Origin, Content-Type, Accept, X-Requested-With, Key, Authorization, Referer-Policy, x-secure-keyboard-id, x-secure-keyboard-fields, sentry-trace, x-tosspayments-device-id, x-tosspayments-session-id, x-publickey-id, tosspayments-test-code, tosspayments-mid, idempotency-key',
    //     'referrer-policy': 'no-referrer-when-downgrade',
    //     'x-content-type-options': 'nosniff',
    //     'x-xss-protection': '1; mode=block',
    //     'cache-control': 'no-cache, no-store, max-age=0, must-revalidate',
    //     pragma: 'no-cache',
    //     expires: '0',
    //     'strict-transport-security': 'max-age=31536000',
    //     server: 'was',
    //     'x-envoy-upstream-service-time': '522'
    //   },
    //   config: {
    //     transitional: {
    //       silentJSONParsing: true,
    //       forcedJSONParsing: true,
    //       clarifyTimeoutError: false
    //     },
    //     adapter: [ 'xhr', 'http', 'fetch' ],
    //     transformRequest: [ [Function: transformRequest] ],
    //     transformResponse: [ [Function: transformResponse] ],
    //     timeout: 0,
    //     xsrfCookieName: 'XSRF-TOKEN',
    //     xsrfHeaderName: 'X-XSRF-TOKEN',
    //     maxContentLength: -1,
    //     maxBodyLength: -1,
    //     env: { FormData: [Function [FormData]], Blob: [class Blob] },
    //     validateStatus: [Function: validateStatus],
    //     headers: Object [AxiosHeaders] {
    //       Accept: 'application/json, text/plain, */*',
    //       'Content-Type': 'application/json',
    //       Authorization: 'Basic dGVzdF9nc2tfZG9jc19PYVB6OEw1S2RtUVhrelJ6M3k0N0JNdzY6',
    //       'User-Agent': 'axios/1.9.0',
    //       'Content-Length': '94',
    //       'Accept-Encoding': 'gzip, compress, deflate, br'
    //     },
    //     method: 'post',
    //     url: 'https://api.tosspayments.com/v1/payments/confirm',
    //     data: '{"paymentKey":"tgen_20250626194853NtWm4","orderId":"ORD-1750934933050-OTYKJs2w","amount":1000}',
    //     allowAbsoluteUrls: true
    //   },
    //   request: <ref *1> ClientRequest {
    //     _events: [Object: null prototype] {
    //       abort: [Function (anonymous)],
    //       aborted: [Function (anonymous)],
    //       connect: [Function (anonymous)],
    //       error: [Function (anonymous)],
    //       socket: [Function (anonymous)],
    //       timeout: [Function (anonymous)],
    //       finish: [Function: requestOnFinish]
    //     },
    //     _eventsCount: 7,
    //     _maxListeners: undefined,
    //     outputData: [],
    //     outputSize: 0,
    //     writable: true,
    //     destroyed: true,
    //     _last: false,
    //     chunkedEncoding: false,
    //     shouldKeepAlive: true,
    //     maxRequestsOnConnectionReached: false,
    //     _defaultKeepAlive: true,
    //     useChunkedEncodingByDefault: true,
    //     sendDate: false,
    //     _removedConnection: false,
    //     _removedContLen: false,
    //     _removedTE: false,
    //     strictContentLength: false,
    //     _contentLength: '94',
    //     _hasBody: true,
    //     _trailer: '',
    //     finished: true,
    //     _headerSent: true,
    //     _closed: true,
    //     _header: 'POST /v1/payments/confirm HTTP/1.1\r\n' +
    //       'Accept: application/json, text/plain, */*\r\n' +
    //       'Content-Type: application/json\r\n' +
    //       'Authorization: Basic dGVzdF9nc2tfZG9jc19PYVB6OEw1S2RtUVhrelJ6M3k0N0JNdzY6\r\n' +
    //       'User-Agent: axios/1.9.0\r\n' +
    //       'Content-Length: 94\r\n' +
    //       'Accept-Encoding: gzip, compress, deflate, br\r\n' +
    //       'Host: api.tosspayments.com\r\n' +
    //       'Connection: keep-alive\r\n' +
    //       '\r\n',
    //     _keepAliveTimeout: 0,
    //     _onPendingData: [Function: nop],
    //     agent: Agent {
    //       _events: [Object: null prototype],
    //       _eventsCount: 2,
    //       _maxListeners: undefined,
    //       defaultPort: 443,
    //       protocol: 'https:',
    //       options: [Object: null prototype],
    //       requests: [Object: null prototype] {},
    //       sockets: [Object: null prototype] {},
    //       freeSockets: [Object: null prototype],
    //       keepAliveMsecs: 1000,
    //       keepAlive: true,
    //       maxSockets: Infinity,
    //       maxFreeSockets: 256,
    //       scheduling: 'lifo',
    //       maxTotalSockets: Infinity,
    //       totalSocketCount: 1,
    //       maxCachedSessions: 100,
    //       _sessionCache: [Object],
    //       [Symbol(shapeMode)]: false,
    //       [Symbol(kCapture)]: false
    //     },
    //     socketPath: undefined,
    //     method: 'POST',
    //     maxHeaderSize: undefined,
    //     insecureHTTPParser: undefined,
    //     joinDuplicateHeaders: undefined,
    //     path: '/v1/payments/confirm',
    //     _ended: true,
    //     res: IncomingMessage {
    //       _events: [Object],
    //       _readableState: [ReadableState],
    //       _maxListeners: undefined,
    //       socket: null,
    //       httpVersionMajor: 1,
    //       httpVersionMinor: 1,
    //       httpVersion: '1.1',
    //       complete: true,
    //       rawHeaders: [Array],
    //       rawTrailers: [],
    //       joinDuplicateHeaders: undefined,
    //       aborted: false,
    //       upgrade: false,
    //       url: '',
    //       method: null,
    //       statusCode: 200,
    //       statusMessage: 'OK',
    //       client: [TLSSocket],
    //       _consuming: true,
    //       _dumped: false,
    //       req: [Circular *1],
    //       _eventsCount: 4,
    //       responseUrl: 'https://api.tosspayments.com/v1/payments/confirm',
    //       redirects: [],
    //       [Symbol(shapeMode)]: true,
    //       [Symbol(kCapture)]: false,
    //       [Symbol(kHeaders)]: [Object],
    //       [Symbol(kHeadersCount)]: 40,
    //       [Symbol(kTrailers)]: null,
    //       [Symbol(kTrailersCount)]: 0
    //     },
    //     aborted: false,
    //     timeoutCb: null,
    //     upgradeOrConnect: false,
    //     parser: null,
    //     maxHeadersCount: null,
    //     reusedSocket: false,
    //     host: 'api.tosspayments.com',
    //     protocol: 'https:',
    //     _redirectable: Writable {
    //       _events: [Object],
    //       _writableState: [WritableState],
    //       _maxListeners: undefined,
    //       _options: [Object],
    //       _ended: true,
    //       _ending: true,
    //       _redirectCount: 0,
    //       _redirects: [],
    //       _requestBodyLength: 94,
    //       _requestBodyBuffers: [],
    //       _eventsCount: 3,
    //       _onNativeResponse: [Function (anonymous)],
    //       _currentRequest: [Circular *1],
    //       _currentUrl: 'https://api.tosspayments.com/v1/payments/confirm',
    //       [Symbol(shapeMode)]: true,
    //       [Symbol(kCapture)]: false
    //     },
    //     [Symbol(shapeMode)]: false,
    //     [Symbol(kCapture)]: false,
    //     [Symbol(kBytesWritten)]: 0,
    //     [Symbol(kNeedDrain)]: false,
    //     [Symbol(corked)]: 0,
    //     [Symbol(kChunkedBuffer)]: [],
    //     [Symbol(kChunkedLength)]: 0,
    //     [Symbol(kSocket)]: TLSSocket {
    //       _tlsOptions: [Object],
    //       _secureEstablished: true,
    //       _securePending: false,
    //       _newSessionPending: false,
    //       _controlReleased: true,
    //       secureConnecting: false,
    //       _SNICallback: null,
    //       servername: 'api.tosspayments.com',
    //       alpnProtocol: false,
    //       authorized: true,
    //       authorizationError: null,
    //       encrypted: true,
    //       _events: [Object: null prototype],
    //       _eventsCount: 9,
    //       connecting: false,
    //       _hadError: false,
    //       _parent: null,
    //       _host: 'api.tosspayments.com',
    //       _closeAfterHandlingError: false,
    //       _readableState: [ReadableState],
    //       _writableState: [WritableState],
    //       allowHalfOpen: false,
    //       _maxListeners: undefined,
    //       _sockname: null,
    //       _pendingData: null,
    //       _pendingEncoding: '',
    //       server: undefined,
    //       _server: null,
    //       ssl: [TLSWrap],
    //       _requestCert: true,
    //       _rejectUnauthorized: true,
    //       timeout: 5000,
    //       parser: null,
    //       _httpMessage: null,
    //       autoSelectFamilyAttemptedAddresses: [Array],
    //       [Symbol(alpncallback)]: null,
    //       [Symbol(res)]: [TLSWrap],
    //       [Symbol(verified)]: true,
    //       [Symbol(pendingSession)]: null,
    //       [Symbol(async_id_symbol)]: -1,
    //       [Symbol(kHandle)]: [TLSWrap],
    //       [Symbol(lastWriteQueueSize)]: 0,
    //       [Symbol(timeout)]: Timeout {
    //         _idleTimeout: 5000,
    //         _idlePrev: [TimersList],
    //         _idleNext: [TimersList],
    //         _idleStart: 27828,
    //         _onTimeout: [Function: bound ],
    //         _timerArgs: undefined,
    //         _repeat: null,
    //         _destroyed: false,
    //         [Symbol(refed)]: false,
    //         [Symbol(kHasPrimitive)]: false,
    //         [Symbol(asyncId)]: 682,
    //         [Symbol(triggerId)]: 680,
    //         [Symbol(kAsyncContextFrame)]: undefined
    //       },
    //       [Symbol(kBuffer)]: null,
    //       [Symbol(kBufferCb)]: null,
    //       [Symbol(kBufferGen)]: null,
    //       [Symbol(shapeMode)]: true,
    //       [Symbol(kCapture)]: false,
    //       [Symbol(kSetNoDelay)]: false,
    //       [Symbol(kSetKeepAlive)]: true,
    //       [Symbol(kSetKeepAliveInitialDelay)]: 1,
    //       [Symbol(kBytesRead)]: 0,
    //       [Symbol(kBytesWritten)]: 0,
    //       [Symbol(connect-options)]: [Object]
    //     },
    //     [Symbol(kOutHeaders)]: [Object: null prototype] {
    //       accept: [Array],
    //       'content-type': [Array],
    //       authorization: [Array],
    //       'user-agent': [Array],
    //       'content-length': [Array],
    //       'accept-encoding': [Array],
    //       host: [Array]
    //     },
    //     [Symbol(errored)]: null,
    //     [Symbol(kHighWaterMark)]: 16384,
    //     [Symbol(kRejectNonStandardBodyWrites)]: false,
    //     [Symbol(kUniqueHeaders)]: null
    //   },
    //   data: {
    //     mId: 'tgen_docs',
    //     lastTransactionKey: 'txrd_a01jynxp0s26y5cy454srqf6hab',
    //     paymentKey: 'tgen_20250626194853NtWm4',
    //     orderId: 'ORD-1750934933050-OTYKJs2w',
    //     orderName: 'premium',
    //     taxExemptionAmount: 0,
    //     status: 'DONE',
    //     requestedAt: '2025-06-26T19:48:53+09:00',
    //     approvedAt: '2025-06-26T19:49:06+09:00',
    //     useEscrow: false,
    //     cultureExpense: false,
    //     card: null,
    //     virtualAccount: null,
    //     transfer: null,
    //     mobilePhone: null,
    //     giftCertificate: null,
    //     cashReceipt: null,
    //     cashReceipts: null,
    //     discount: null,
    //     cancels: null,
    //     secret: 'ps_DLJOpm5QrlO1J45gP1xLVPNdxbWn',
    //     type: 'NORMAL',
    //     easyPay: { provider: '토스페이', amount: 1000, discountAmount: 0 },
    //     country: 'KR',
    //     failure: null,
    //     isPartialCancelable: true,
    //     receipt: {
    //       url: 'https://dashboard.tosspayments.com/receipt/redirection?transactionId=tgen_20250626194853NtWm4&ref=PX'
    //     },
    //     checkout: {
    //       url: 'https://api.tosspayments.com/v1/payments/tgen_20250626194853NtWm4/checkout'
    //     },
    //     currency: 'KRW',
    //     totalAmount: 1000,
    //     balanceAmount: 1000,
    //     suppliedAmount: 909,
    //     vat: 91,
    //     taxFreeAmount: 0,
    //     method: '간편결제',
    //     version: '2022-11-16',
    //     metadata: null
    //   }
    // }
    // console.log('🚀 ~ verifyPayment ~ paymentData:', paymentData);
    // 🚀 ~ verifyPayment ~ paymentData: {
    //   paymentKey: 'tgen_20250626194628MPGj7',
    //   paymentPrice: 1000,
    //   paymentStatus: 'COMPLETED',
    //   paymentMethod: '간편결제',
    //   userId: 1,
    //   cardNumber: 'UNKNOWN',
    //   cardType: 'UNKNOWN',
    //   suppliedPrice: 909,
    //   vat: 91
    // }

    try {
      const newPayment = await Payment.create(paymentData);
      res.json({ result: true, data: newPayment, message: '결제 확인 성공' });
    } catch (error) {
      console.error('DB 저장 실패:', error);
      return res.status(500).json({
        result: false,
        message: '결제 정보를 저장하는 데 실패했습니다.',
      });
    }
  } catch (error) {
    res.json({ result: false, message: '서버오류', error: error.message });
  }
};
