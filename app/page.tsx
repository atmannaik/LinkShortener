import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { SignUpButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Link2,
  BarChart3,
  Zap,
  Shield,
  Globe,
  MousePointerClick,
} from 'lucide-react';

const features = [
  {
    icon: Link2,
    title: 'Custom Short Links',
    description:
      'Create memorable, branded short links for any URL in seconds.',
  },
  {
    icon: BarChart3,
    title: 'Click Analytics',
    description:
      'Track every click and gain insights into who is visiting your links.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'Ultra-low latency redirects powered by edge infrastructure worldwide.',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description:
      'Your links are protected with industry-standard security practices.',
  },
  {
    icon: Globe,
    title: 'Share Anywhere',
    description:
      'Works across social media, email, SMS, and any other platform.',
  },
  {
    icon: MousePointerClick,
    title: 'Easy to Use',
    description:
      'Intuitive dashboard to manage all your links in one place.',
  },
];

const steps = [
  { step: '1', title: 'Paste your URL', description: 'Enter any long URL into the link shortener.' },
  { step: '2', title: 'Get a short link', description: 'Receive a compact, shareable short link instantly.' },
  { step: '3', title: 'Share & track', description: 'Share it anywhere and monitor performance in real time.' },
];

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <Badge variant="secondary" className="mb-6">
          Free to get started
        </Badge>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          Shorten URLs,{' '}
          <span className="text-primary">Amplify Your Reach</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">
          Transform long, unwieldy URLs into clean, trackable short links.
          Share smarter and measure what matters.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <SignUpButton mode="modal">
            <Button size="lg" className="px-8">
              Get Started — It&apos;s Free
            </Button>
          </SignUpButton>
        </div>
      </main>

      {/* Features */}
      <section className="border-t bg-muted/30 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-foreground">
            Everything you need
          </h2>
          <p className="mb-12 text-center text-muted-foreground">
            Powerful features to help you manage and track your links.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <Card key={title}>
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-foreground">
            How it works
          </h2>
          <p className="mb-12 text-center text-muted-foreground">
            Get your first short link in under a minute.
          </p>
          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map(({ step, title, description }) => (
              <div key={step} className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  {step}
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-muted/30 px-6 py-20">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground">
            Ready to get started?
          </h2>
          <p className="mb-8 text-muted-foreground">
            Join thousands of users shortening and tracking their links today.
          </p>
          <SignUpButton mode="modal">
            <Button size="lg" className="px-10">
              Create Your Free Account
            </Button>
          </SignUpButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} LinkShortener. All rights reserved.
      </footer>
    </div>
  );
}
