'use client';

import { CheckCircle2, GitBranch, Heart, Lightbulb, Target, Users, Wrench } from 'lucide-react';
import Image from 'next/image';

enum Expertise {
  FS = 'Full Stack',
  BE = 'Backend',
  FE = 'Frontend',
  ARC = 'Architecture',
  DES = 'Design',
  UIUX = 'UI/UX',
  DEP = 'Deployment',
}

enum Role {
  FS = 'Full Stack Developer',
  SA = 'Software Architect',
}

export default function Team() {
  const teamMembers = [
    {
      name: 'Hanna JEST Dolzycka',
      role: Role.FS,
      image: 'https://avatars.githubusercontent.com/u/173495618?v=4',
      bio: 'Test Driven Development ist ihr zweiter Vorname.',
      expertise: [Expertise.FS, Expertise.ARC, Expertise.UIUX],
      profile: 'https://github.com/dolzycka',
    },
    {
      name: 'Rominasadat Mirmehdi',
      role: Role.FS,
      image: 'https://avatars.githubusercontent.com/u/148480006?v=4',
      bio: '...ist nur ab 24 Uhr erreichbar.',
      expertise: [Expertise.FS, Expertise.UIUX],
      profile: 'https://github.com/Romina00',
    },
    {
      name: 'Hannes Pralle',
      role: Role.SA,
      image: 'https://avatars.githubusercontent.com/u/176742631?v=4',
      bio: 'Benutzt Word als IDE.',
      expertise: [Expertise.FS, Expertise.ARC, Expertise.UIUX, Expertise.DES],
      profile: 'https://github.com/hpbexxter',
    },
    {
      name: 'Imran Timur',
      role: Role.FS,
      image: 'https://avatars.githubusercontent.com/u/141875371?v=4',
      bio: 'Linus Torvald`s rechte Hand.',
      expertise: [Expertise.FS, Expertise.ARC, Expertise.DEP],
      profile: 'https://github.com/orkzahn',
    },
    {
      name: 'Max Uden',
      role: Role.SA,
      image: 'https://avatars.githubusercontent.com/u/93664429?v=4',
      bio: '...hat auch schon eine Zeile Code ohne GPT geschrieben.',
      expertise: [Expertise.FS, Expertise.ARC, Expertise.UIUX],
      profile: 'https://github.com/Maxlo158',
    },
  ];

  // https://github.com/devicons/devicon/tree/master/icons
  // Repo for logos
  const tools = [
    {
      name: 'Next.js',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
      link: 'https://nextjs.org/',
    },
    {
      name: 'TypeScript',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
      link: 'https://www.typescriptlang.org/',
    },
    {
      name: 'Tailwind CSS',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
      link: 'https://tailwindcss.com/',
    },
    {
      name: 'React',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      link: 'https://reactjs.org/',
    },
    {
      name: 'Prisma',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg',
      link: 'https://www.prisma.io/',
    },
    {
      name: 'PostgreSQL',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
      link: 'https://www.postgresql.org/',
    },
    {
      name: 'Vercel',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg',
      link: 'https://vercel.com/',
    },
    {
      name: 'OpenAI',
      logo: 'https://logo.svgcdn.com/logos/openai-icon.svg',
      link: 'https://openai.com/',
    },
    {
      name: 'Docker',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
      link: 'https://www.docker.com/',
    },
  ];

  const github =
    'https://raw.githubusercontent.com/devicons/devicon/refs/heads/master/icons/github/github-original.svg';
  // const processSteps = [
  //   {
  //     title: 'Anfrage analysieren',
  //     description: 'KI-gestützte Analyse der rechtlichen Anfrage',
  //     icon: GitBranch,
  //   },
  //   {
  //     title: 'Matching durchführen',
  //     description: 'Algorithmus findet passende Organisationen',
  //     icon: Target,
  //   },
  //   {
  //     title: 'Qualität sichern',
  //     description: 'Manuelle Überprüfung durch unser Team',
  //     icon: CheckCircle2,
  //   },
  //   {
  //     title: 'Vermittlung optimieren',
  //     description: 'Kontinuierliche Verbesserung basierend auf Feedback',
  //     icon: Lightbulb,
  //   },
  // ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-linear-to-b from-primary/5 to-background">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-foreground mb-6 text-balance">
              Entwickler*innen hinter JuriLib
            </h1>
          </div>
        </section>

        {/* Motivation Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto ">
            <div className="flex items-start gap-6 bg-card rounded-2xl p-8 shadow-lg border border-border">
              <div className="bg-linear-to-br from-accent-red to-accent-red/60 p-4 rounded-xl shrink-0 shadow-sm">
                <Heart className="w-8 h-8 text-accent-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-4">Unsere Motivation</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  Wir glauben, dass jeder Mensch Zugang zu qualifizierter Rechtsberatung haben
                  sollte. Zu oft scheitert die Suche nach dem richtigen Rechtsbeistand an fehlender
                  Transparenz und komplexen Prozessen.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  JuriLib wurde gegründet, um diese Hürden zu überwinden. Wir kombinieren modernste
                  Technologie mit rechtlicher Expertise, um Menschen schnell und unkompliziert mit
                  den passenden Rechtsdienstleistern zu verbinden.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Members */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Das sind Wir</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-background rounded-2xl overflow-hidden shadow-lg border border-border hover:shadow-2xl transition-shadow duration-300 animate-fade-in hover:scale-105"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => window.open(member.profile)}
                >
                  <div className="aspect-square overflow-hidden bg-muted relative">
                    <Image
                      src={member.image || '/placeholder.svg'}
                      alt={member.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-1">{member.name}</h3>
                    <p className="text-primary font-medium mb-3">{member.role}</p>
                    <p className="text-muted-foreground mb-4 leading-relaxed">{member.bio}</p>
                    <div className="flex flex-wrap gap-2">
                      {member.expertise.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-accent-gray-soft text-primary text-sm rounded-full border border-primary/10 shadow-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Tools Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-start gap-6 bg-card rounded-2xl p-8 shadow-lg border border-border">
              <div className="bg-linear-to-br from-accent-amber/90 to-accent-amber/60 p-4 rounded-xl shrink-0">
                <Wrench className="w-8 h-8 text-accent-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-foreground mb-6">Das nutzen wir</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Wir setzen auf moderne, bewährte Technologien für eine schnelle, sichere und
                  skalierbare Plattform.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {tools.map((tool, index) => (
                    <a
                      key={index}
                      href={tool.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors"
                    >
                      <Image
                        src={tool.logo}
                        alt={tool.name}
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                      <span className="font-semibold text-foreground">{tool.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-start gap-6 bg-card rounded-2xl p-8 shadow-lg border border-border">
              <div className="bg-linear-to-br from-accent-emerald/80 to-accent-emerald/60 p-4 rounded-xl shrink-0 shadow-sm">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-foreground mb-6">
                  Ihr sucht uns? Hier findet ihr uns!
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Open Source, denn gute Software sollte für alle zugänglich sein.
                </p>

                {/* {processSteps.map((step, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-6 bg-muted/50 rounded-xl hover:bg-muted transition-colors"
                    >
                      <div className="bg-primary/10 p-3 rounded-lg shrink-0 shadow-sm">
                        <step.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
                        <p className="text-muted-foreground text-sm">{step.description}</p>
                      </div>
                    </div>
                  ))} */}

                <div className="flex items-center gap-6">
                  <Image
                    src={github}
                    alt="GitHub Repository Screenshot"
                    width={200}
                    height={200}
                    className="rounded-xl"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      JuriLib ist Open Source!
                    </h2>
                    <p className="text-muted-foreground">
                      Schaut gerne in unserem{' '}
                      <a
                        href="https://github.com/projekt-bht/jurilib"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline hover:text-primary/80"
                      >
                        GitHub Repository
                      </a>{' '}
                      vorbei, um den Code einzusehen.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
