class RegisterEmailTemplate {
  MailSent(data) {
    return `
      <!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Secure Fintec</title>
	<style>
		@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');
		body {
			margin: 0;
			padding: 0;
			font-size:14px;
            font-family: 'Poppins', sans-serif;
            color: #000;
		}
		.page-main {
			width: 600px;
			margin: auto;
		}
		.table {
			border-collapse: collapse;
		}
		.table td, .table th {
			padding: 10px;
			vertical-align: top;
		}		
	</style>
</head>
<body>
	<table class="table page-main" align="center">
		<tr>
			<td>
				<img src="${process.env.BACKEND_UPLOAD_DIR}Secure Fintec Logo.png" style="display:block; margin-bottom: 20px; margin-left: auto; max-width:200px;">
			</td>
		</tr>
		<tr>
			<td style="padding-bottom: 50px;">
				<h1 style="margin: 0 0 10px 0; font-size: 30px;">INVOICE</h1>
				<p style="margin: 0 0 0px 0;">Invoice number: <strong>${data.invoiceNumber}</strong></p>
				<p style="margin: 0 0 0px 0;">Invoice date: <strong>${data.invoiceDate}</strong></p>
			</td>
		</tr>
		<tr>
			<td style="padding-bottom: 20px;">
				<p style="margin: 0 0 0px 0; text-transform: capitalize;">Dear ${data.userName},</p>
				<p style="margin: 0 0 0px 0;">Your Package is calculated as follows:</p>
			</td>
		</tr>
		<tr>
			<td style="padding:0;">
				<table class="table" width="100%">						
					<thead>
						<tr>
							<th width="45%" style="text-align:left; border-bottom: 2px solid #333;">Activation services</th>
							<th style="text-align: right; border-bottom: 2px solid #333;">Net amount</th>
							<th style="text-align: right; border-bottom: 2px solid #333;">VAT rate</th>
							<th style="text-align: right; border-bottom: 2px solid #333;">VAT amount</th>
							<th style="text-align: right; border-bottom: 2px solid #333;">Gross amount</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td style="border-bottom: 1px solid #333; text-align: left;">${data.packageName}
								<span style="display:block; font-size:12px; margin-top:5px;">Duration: ${data.packageDuration}</span>
							</td>
							<td style="border-bottom: 1px solid #333;text-align: right;">${data.netAmount} ${data.currencyName}</td>
							<td style="border-bottom: 1px solid #333;text-align: right;">0.00%</td>
							<td style="border-bottom: 1px solid #333;text-align: right;">0.00 ${data.currencyName}</td>
							<td style="border-bottom: 1px solid #333;text-align: right;">${data.totalAmount} ${data.currencyName}</td>
						</tr>
					</tbody>
				</table>
			</td>
		</tr>
		<tr>
			<td style="text-align: right; font-size: 18px; padding:20px 0 30px 0px;"><strong>Invoice amount: ${data.totalAmount} ${data.currencyName}</strong></td>
		</tr>
		<tr>
			<td>
				<p style="margin: 0 0 5px 0; font-size: 11px;"><strong>Thank you for your purchase</strong></p>
				<p style="margin: 0 0 5px 0; font-size: 11px;"><strong>Secure Fintec</strong></p>
				<p style="margin: 0 0 0px 0; font-size: 11px;"><strong><a href="#" style="color: #333; text-decoration: none;">info@securefintec.com</a></strong></p>
			</td>
		</tr>
	</table>
</body>
</html>`;
  }
}

module.exports = new RegisterEmailTemplate();
