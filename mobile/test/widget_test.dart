import 'package:flutter_test/flutter_test.dart';
import 'package:shopnest/main.dart';

void main() {
  testWidgets('App starts successfully', (WidgetTester tester) async {
    await tester.pumpWidget(const ShopNestApp());
    expect(find.text('ShopNest'), findsOneWidget);
  });
}
