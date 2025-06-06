import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Link,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
  name: string;
  userType?: 'carrier' | 'goods' | 'agent' | 'truck-owner';
}

export const WelcomeEmail = ({ name }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to Loads Africa - Your Logistics Partner</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={heading}>Welcome to Loads Africa, {name}!</Text>
        <Text style={paragraph}>
          Thank you for joining Loads Africa. We're excited to have you on board and help you streamline your logistics operations.
        </Text>
        <Hr style={hr} />
        <Section>
          <Text style={paragraph}>
            To get started, please reply to this email with the following required documents:
          </Text>
          <ul>
            <li style={listItem}>Company Registration Documents (Business Registration/Certificate)</li>
            <li style={listItem}>Tax Registration Certificate</li>
            <li style={listItem}>For each truck: Registration documents, insurance certificates, and roadworthy certificates</li>
            <li style={listItem}>For each driver: Valid driver's license, professional driving permit, and ID document</li>
          </ul>
        </Section>
        <Text style={paragraph}>
          Once we receive and verify your documents, you can:
        </Text>
        <ul>
          <li style={listItem}>Complete your profile</li>
          <li style={listItem}>Browse available loads</li>
          <li style={listItem}>Set up your trucks and drivers</li>
        </ul>
        <Text style={paragraph}>
          If you have any questions about the required documentation or need assistance, our support team is here to help you. Just reply to this email.
        </Text>
        <Text style={paragraph}>
          Best regards,<br />
          The Loads Africa Team
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const heading = {
  fontSize: '24px',
  letterSpacing: '-0.5px',
  lineHeight: '1.3',
  fontWeight: '400',
  color: '#484848',
  padding: '17px 0 0',
};

const paragraph = {
  margin: '0 0 15px',
  fontSize: '15px',
  lineHeight: '1.4',
  color: '#3c4149',
};

const listItem = {
  margin: '8px 0',
  fontSize: '15px',
  lineHeight: '1.4',
  color: '#3c4149',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};