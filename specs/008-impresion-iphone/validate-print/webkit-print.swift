// Prints an HTML file to a letter PDF with WebKit (Safari's engine): webkit-print in.html out.pdf
import AppKit
import WebKit

final class Printer: NSObject, WKNavigationDelegate {
    let web = WKWebView(frame: NSRect(x: 0, y: 0, width: 816, height: 1056))
    let output: URL
    init(input: URL, output: URL) {
        self.output = output
        super.init()
        web.navigationDelegate = self
        web.loadFileURL(input, allowingReadAccessTo: URL(fileURLWithPath: "/"))
    }
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) { self.print() }
    }
    func print() {
        let info = NSPrintInfo()
        info.paperSize = NSSize(width: 612, height: 792)
        info.topMargin = 0; info.bottomMargin = 0; info.leftMargin = 0; info.rightMargin = 0
        info.horizontalPagination = .fit
        info.verticalPagination = .automatic
        info.jobDisposition = .save
        info.dictionary()[NSPrintInfo.AttributeKey.jobSavingURL] = output
        let op = web.printOperation(with: info)
        op.showsPrintPanel = false
        op.showsProgressPanel = false
        op.view?.frame = web.bounds
        let window = NSWindow(contentRect: web.bounds, styleMask: [.borderless], backing: .buffered, defer: false)
        window.contentView = web
        op.runModal(for: window, delegate: self, didRun: #selector(done), contextInfo: nil)
    }
    @objc func done() { exit(0) }
}

let args = CommandLine.arguments
let app = NSApplication.shared
app.setActivationPolicy(.prohibited)
let printer = Printer(input: URL(fileURLWithPath: args[1]), output: URL(fileURLWithPath: args[2]))
DispatchQueue.main.asyncAfter(deadline: .now() + 20) { FileHandle.standardError.write("timeout\n".data(using: .utf8)!); exit(2) }
app.run()
