declare module 'nodemailer-mandrill-transport' {
  export interface MandrillOptions {
    auth: {
      apiKey: string;
    };
  };

  declare function MandrillTransport(options: MandrillOptions);

  export = MandrillTransport;
}
