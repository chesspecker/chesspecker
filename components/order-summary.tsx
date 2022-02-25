import {Col, Row} from 'antd';

const OrderSummary = () => {
	return (
		<div className=''>
			<Row>
				<Col span={1}>
					<div className=''></div>
				</Col>
				<Col span={23}>
					<Row>
						<Col span={12}>
							<div className=''>
								<h3>Standard subscription</h3>
							</div>
						</Col>
						<Col span={12}>
							<div className=''>
								<p>$10.00 monthly</p>
							</div>
						</Col>
					</Row>
					<hr></hr>
					<h3>Today's charge: $10.00</h3>
				</Col>
			</Row>
		</div>
	);
};

export default OrderSummary;
