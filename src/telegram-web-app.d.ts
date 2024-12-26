
interface TelegramWebApp {
    version: string;
    initData: string;
    initDataUnsafe: any;
    WebView: {
      initParams: {
        tgWebVersion?: string;
      };
    };
    openInvoice?: (invoiceLink: string, callback?: (status: string) => void) => void;
  }
  
  interface Window {
    Telegram: {
      WebApp: TelegramWebApp;
      WebView?: TelegramWebView;
    };
  }
  