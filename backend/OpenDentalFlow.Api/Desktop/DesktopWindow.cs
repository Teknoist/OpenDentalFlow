using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.Wpf;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

namespace OpenDentalFlow.Api.Desktop;

public sealed class DesktopWindow : Window
{
    private readonly WebView2 webView = new();
    private readonly string startUrl;

    public DesktopWindow(string startUrl)
    {
        this.startUrl = startUrl;
        Title = "OpenDental Lab";
        Width = 1440;
        Height = 900;
        MinWidth = 1024;
        MinHeight = 700;
        WindowStartupLocation = WindowStartupLocation.CenterScreen;
        Background = new SolidColorBrush(Color.FromRgb(244, 247, 246));
        Content = BuildLayout();
        Loaded += OnLoaded;
    }

    private UIElement BuildLayout()
    {
        var grid = new Grid();
        grid.RowDefinitions.Add(new RowDefinition());
        grid.Children.Add(webView);
        return grid;
    }

    private async void OnLoaded(object sender, RoutedEventArgs e)
    {
        try
        {
            var userData = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "OpenDentalFlow", "WebView2");
            Directory.CreateDirectory(userData);
            var environment = await CoreWebView2Environment.CreateAsync(null, userData);
            await webView.EnsureCoreWebView2Async(environment);
            webView.CoreWebView2.Settings.AreDevToolsEnabled = false;
            webView.CoreWebView2.Settings.AreDefaultContextMenusEnabled = false;
            webView.CoreWebView2.Settings.IsStatusBarEnabled = false;
            webView.Source = new Uri(startUrl);
        }
        catch (Exception ex)
        {
            MessageBox.Show($"OpenDental Lab arayüzü başlatılamadı.\n\n{ex.Message}", "Başlatma hatası", MessageBoxButton.OK, MessageBoxImage.Error);
            Close();
        }
    }
}
