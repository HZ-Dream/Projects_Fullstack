const { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } = require('vnpay');
const Bill = require('../../models/Bill');
const User = require('../../models/User');

function generateTxnRef() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const MM = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    const random = Math.floor(100000 + Math.random() * 900000);
    return `ORDER_${hh}${mm}${dd}${MM}${yyyy}_${random}`; // example: ORDER_194510032026_839201
}

class payVNPay {
    // [POST] /vnpay/create
    async create(req, res) {
        try {
            const { userId, namePack, pricePack, tokenPack } = req.body;

            const txnRef = generateTxnRef();

            const newBill = new Bill({
                userId,
                txnRef,
                namePack,
                pricePack,
                tokenPack,
                amount: pricePack,
                status: 'pending',
            });

            await newBill.save();

            // 15 minutes
            const expireDate = new Date(Date.now() + 15 * 60 * 1000);

            const vnpay = new VNPay({
                tmnCode: 'UC4LWH37',
                secureSecret: 'V6MLXS5QDTT0UVFZ07QPWR3WYMRT64OX',
                vnpayHost: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
                testMode: true,
                hashAlgorithm: 'SHA512',
                loggerFn: ignoreLogger,
            });

            const paymentUrl = vnpay.buildPaymentUrl({
                vnp_Amount: pricePack,
                vnp_IpAddr: req.ip,
                vnp_TxnRef: txnRef,
                vnp_OrderInfo: `Thanh toán gói token ${namePack}`,
                vnp_OrderType: ProductCode.Other,
                vnp_ReturnUrl: 'http://localhost:4000/api/vnpay/return',
                vnp_Locale: VnpLocale.VN,
                vnp_CreateDate: dateFormat(new Date()),
                vnp_ExpireDate: dateFormat(expireDate),
            });

            res.status(200).json(paymentUrl);
        } catch (err) {
            console.log(err);
            res.status(500).json({
                msg: 'Something went wrong!',
            });
        }
    }

    // [GET] //vnpay/return
    async return(req, res) {
        try {
            const { vnp_ResponseCode, vnp_TxnRef } = req.query;

            const bill = await Bill.findOne({ txnRef: vnp_TxnRef });

            if (!bill) {
                return res.redirect('http://localhost:3000/token?payment=error');
            }

            if (vnp_ResponseCode === '00') {
                bill.status = 'success';

                await bill.save();

                const user = await User.findById(bill.userId);

                user.token += bill.tokenPack;

                await user.save();

                return res.redirect('http://localhost:3000/token?payment=success');
            } else {
                bill.status = 'failed';

                await bill.save();

                return res.redirect('http://localhost:3000/token?payment=failed');
            }
        } catch (err) {
            console.log(err);

            res.redirect('http://localhost:3000/token?payment=error');
        }
    }
}

module.exports = new payVNPay();
