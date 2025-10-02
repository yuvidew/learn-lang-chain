import { ContractAnalysis } from '@/types/type'
import { AlertTriangle, Calendar, CalendarIcon, CheckCircle, Clock, DollarSign, FileText, FlagIcon, Shield, Users, XCircle } from 'lucide-react'
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";


interface Props {
    contractData: ContractAnalysis
}

const tabsList = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'parties', label: 'Parties & Terms', icon: Users },
    { id: 'obligations', label: 'Obligations', icon: CheckCircle },
    { id: 'dates', label: 'Important Dates', icon: Calendar },
    { id: 'risks', label: 'Risks & Issues', icon: AlertTriangle },
    { id: 'analysis', label: 'Analysis', icon: Shield }
];

export const ResultDoc = ({ contractData }: Props) => {
    const formatDate = (dateStr: string) => {
        if (dateStr.includes('months from')) return dateStr;
        try {
            return new Date(dateStr).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return dateStr;
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity?.toLowerCase()) {
            case 'high':
                return 'bg-red-100 border-red-300 text-red-800';
            case 'medium':
                return 'bg-orange-100 border-orange-300 text-orange-800';
            case 'low':
                return 'bg-yellow-100 border-yellow-300 text-yellow-800';
            default:
                return 'bg-gray-100 border-gray-300 text-gray-800';
        }
    };

    const getDateTypeColor = (type: string) => {
        switch (type?.toLowerCase()) {
            case 'deadline':
                return 'bg-red-50 border-red-200';
            case 'milestone':
                return 'bg-blue-50 border-blue-200';
            case 'termination':
                return 'bg-orange-50 border-orange-200';
            default:
                return 'bg-gray-50 border-gray-200';
        }
    };

    const hasPaymentTerms = contractData.payment_terms && Object.values(contractData.payment_terms).some(val => val !== null);

    return (
        <section className=' w-full h-full py-[20px]'>
            <div className=' m-auto w-[70%] p-3 bg-accent rounded-sm flex flex-col gap-5 '>
                {/* start to  header */}

                <div className=' bg-sidebar p-6 rounded-md'>
                    <h1 className="text-2xl font-bold mb-2">Contract Analysis Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            <span className="font-medium">{contractData.contract_type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            <span>{contractData.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-lg">
                            <Users className="w-5 h-5" />
                            <span>{contractData.parties?.length || 0} Parties</span>
                        </div>
                    </div>
                </div>
                {/* end to  header */}

                {/* start tabs */}
                <Tabs defaultValue="overview" className="w-full">
                    <ScrollArea className="w-full rounded-md  whitespace-nowrap pb-2">
                        <TabsList className=' gap-6 '>
                            {tabsList.map(({ id, label, icon }) => {
                                const Icon = icon;
                                return (
                                    <TabsTrigger key={id} value={id}>
                                        <Icon />
                                        {label}
                                    </TabsTrigger>
                                )
                            })}
                        </TabsList>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                    {/* start to overview content */}
                    <TabsContent value="overview">
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-lg border border-blue-200">
                                    <h3 className="font-semibold text-blue-900 mb-1 text-sm">Contract Type</h3>
                                    <p className="text-blue-700 text-lg font-medium">{contractData.contract_type}</p>
                                </div>
                                <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-lg border border-green-200">
                                    <h3 className="font-semibold text-green-900 mb-1 text-sm">Duration</h3>
                                    <p className="text-green-700 text-lg font-medium">{contractData.duration}</p>
                                </div>
                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-lg border border-purple-200">
                                    <h3 className="font-semibold text-purple-900 mb-1 text-sm">Effective Date</h3>
                                    <p className="text-purple-700 text-lg font-medium">{formatDate(contractData.effective_date)}</p>
                                </div>
                                <div className="bg-gradient-to-br from-red-50 to-red-100 p-5 rounded-lg border border-red-200">
                                    <h3 className="font-semibold text-red-900 mb-1 text-sm">Red Flags</h3>
                                    <p className="text-red-700 text-lg font-medium">{contractData.red_flags?.length || 0} Identified</p>
                                </div>
                            </div>

                            {/* Key Terms */}
                            {contractData.key_terms && (
                                <div className="bg-white border rounded-lg p-5">
                                    <h2 className="text-xl font-bold text-gray-800 mb-4">Key Terms</h2>
                                    <div className="space-y-3">
                                        <div>
                                            <h3 className="font-semibold text-gray-700 mb-1">Scope of Work</h3>
                                            <p className="text-gray-600">{contractData.key_terms.scope_of_work}</p>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-700 mb-1">Territory</h3>
                                            <p className="text-gray-600">{contractData.key_terms.territory}</p>
                                        </div>
                                        {contractData.key_terms.deliverables && contractData.key_terms.deliverables.length > 0 && (
                                            <div>
                                                <h3 className="font-semibold text-gray-700 mb-1">Deliverables</h3>
                                                <ul className="list-disc list-inside text-gray-600">
                                                    {contractData.key_terms.deliverables.map((item, idx) => (
                                                        <li key={idx}>{item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Critical Alerts */}
                            {contractData.red_flags && contractData.red_flags.length > 0 && (
                                <div className="bg-red-50 border-2 border-red-300 rounded-lg p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FlagIcon className="w-6 h-6 text-red-600" />
                                        <h2 className="text-xl font-bold text-red-800">Critical Red Flags</h2>
                                    </div>
                                    <div className="space-y-2">
                                        {contractData.red_flags.map((flag, idx) => (
                                            <div key={idx} className="flex items-start gap-2">
                                                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                                <p className="text-red-800">{flag}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Missing Elements */}
                            {contractData.missing_elements && contractData.missing_elements.length > 0 && (
                                <div className="bg-orange-50 border border-orange-300 rounded-lg p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <XCircle className="w-6 h-6 text-orange-600" />
                                        <h2 className="text-xl font-bold text-orange-800">Missing Elements</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {contractData.missing_elements.map((element, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-orange-800">
                                                <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                                                <span>{element}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                    {/* end to overview content */}

                    {/* start to parties */}
                    <TabsContent value="parties">
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Parties Involved</h2>
                            {contractData.parties?.map((party, index) => (
                                <div key={index} className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-5">
                                    <div className="flex items-start gap-3">
                                        <Users className="w-6 h-6 text-indigo-600 mt-1" />
                                        <div className="flex-1">
                                            <h3 className="font-bold text-xl text-indigo-900 mb-1">{party.name}</h3>
                                            <p className="text-indigo-700 font-medium mb-2">{party.role}</p>
                                            <p className="text-indigo-600 text-sm">{party.contact_info}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Payment Terms */}
                            <div className="bg-white border rounded-lg p-5">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <DollarSign className="w-6 h-6" />
                                    Payment Terms
                                </h2>
                                {hasPaymentTerms ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {Object.entries(contractData.payment_terms).map(([key, value]) => (
                                            value && (
                                                <div key={key} className="bg-gray-50 p-3 rounded">
                                                    <h3 className="font-semibold text-gray-700 text-sm capitalize mb-1">
                                                        {key.replace(/_/g, ' ')}
                                                    </h3>
                                                    <p className="text-gray-600">{value}</p>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <p className="text-red-800 font-medium">⚠️ No payment terms specified in this contract</p>
                                    </div>
                                )}
                            </div>

                            {/* Special Clauses */}
                            {contractData.special_clauses && contractData.special_clauses.length > 0 && (
                                <div className="bg-white border rounded-lg p-5">
                                    <h2 className="text-xl font-bold text-gray-800 mb-4">Special Clauses</h2>
                                    <div className="space-y-3">
                                        {contractData.special_clauses.map((clause, idx) => (
                                            <div key={idx} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                <h3 className="font-semibold text-blue-900 mb-1">{clause.title}</h3>
                                                <p className="text-blue-800">{clause.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                    {/* end to parties */}

                    {/* start to obligations */}
                    <TabsContent value='obligations'>
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Obligations & Responsibilities</h2>
                            {contractData.obligations && Object.entries(contractData.obligations).map(([party, obligations], index) => (
                                <div key={index} className="bg-white border-2 rounded-lg p-5">
                                    <h3 className="font-bold text-lg text-indigo-700 mb-4 flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5" />
                                        {party}
                                    </h3>
                                    <div className="space-y-2">
                                        {obligations.map((obligation, idx) => (
                                            <div key={idx} className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                                                <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                                                <p className="text-gray-700">{obligation}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {/* Termination & Renewal */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {contractData.termination_clauses && contractData.termination_clauses.length > 0 && (
                                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-5">
                                        <h3 className="font-bold text-lg text-orange-800 mb-3">Termination Clauses</h3>
                                        {contractData.termination_clauses.map((clause, idx) => (
                                            <div key={idx} className="space-y-2">
                                                <p className="text-orange-700"><strong>Type:</strong> {clause.type}</p>
                                                {clause.notice_period && (
                                                    <p className="text-orange-700"><strong>Notice Period:</strong> {clause.notice_period}</p>
                                                )}
                                                {clause.conditions && (
                                                    <p className="text-orange-700"><strong>Conditions:</strong> {clause.conditions}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {contractData.renewal_terms && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                                        <h3 className="font-bold text-lg text-green-800 mb-3">Renewal Terms</h3>
                                        <p className="text-green-700">{contractData.renewal_terms}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>
                    {/* end to obligations */}

                    {/* start to dates*/}
                    <TabsContent value='dates' >
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Important Dates & Deadlines</h2>
                            <div className="space-y-3">
                                {contractData.important_dates?.map((dateItem, index) => (
                                    <div key={index} className={`flex items-center gap-4 p-4 rounded-lg border-2 ${getDateTypeColor(dateItem.type)}`}>
                                        <Calendar className="w-8 h-8 text-gray-700 flex-shrink-0" />
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-900">{formatDate(dateItem.date)}</p>
                                            <p className="text-gray-700">{dateItem.description}</p>
                                        </div>
                                        <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700 capitalize">
                                            {dateItem.type}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabsContent>
                    {/* end to dates*/}

                    {/* start to payment */}
                    <TabsContent value="payment">
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-muted-foreground mb-4">Payment Terms</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-green-800 mb-2">Amount</h3>
                                    <p className="text-green-700 text-lg">{contractData.payment_terms.amount}</p>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-blue-800 mb-2">Schedule</h3>
                                    <p className="text-blue-700">{contractData.payment_terms.schedule}</p>
                                </div>
                                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-purple-800 mb-2">Payment Method</h3>
                                    <p className="text-purple-700">{contractData.payment_terms.method}</p>
                                </div>
                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-orange-800 mb-2">Penalties</h3>
                                    <p className="text-orange-700">{contractData.payment_terms.penalties}</p>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                    {/* end to payment */}

                    {/* start to risk */}
                    <TabsContent value="risks">
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Risk Assessment</h2>

                            {contractData.risks && contractData.risks.length > 0 && (
                                <div className="space-y-4">
                                    {contractData.risks.map((risk, index) => (
                                        <div key={index} className={`border-2 rounded-lg p-5 ${getSeverityColor(risk.severity)}`}>
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <AlertTriangle className="w-5 h-5" />
                                                    <h3 className="font-bold text-lg capitalize">{risk.category} Risk</h3>
                                                </div>
                                                <span className="px-3 py-1 bg-white rounded-full text-sm font-bold uppercase">
                                                    {risk.severity}
                                                </span>
                                            </div>
                                            <p className="mb-3 font-medium">{risk.description}</p>
                                            <div className="bg-white/50 rounded p-3 mt-2">
                                                <p className="text-sm font-semibold mb-1">Mitigation:</p>
                                                <p className="text-sm">{risk.mitigation}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </TabsContent>
                    {/* end to risk */}

                    {/* start to analysis text */}
                    <TabsContent value="analysis">
                        <div className="space-y-6">
                            <div className="prose max-w-none">

                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeHighlight]}
                                    components={{
                                        // Custom component overrides
                                        h1: ({ children }) => (
                                            <h1 className="text-4xl font-bold  mb-6 mt-8 border-b pb-2">
                                                {children}
                                            </h1>
                                        ),
                                        h2: ({ children }) => (
                                            <h2 className="text-3xl font-semibold  mb-4 mt-6">{children}</h2>
                                        ),
                                        h3: ({ children }) => (
                                            <h3 className="text-2xl font-medium  mb-3 mt-4">{children}</h3>
                                        ),
                                        p: ({ children }) => (
                                            <p className=" mb-4 leading-relaxed">{children}</p>
                                        ),
                                        ul: ({ children }) => (
                                            <ul className="list-disc list-inside mb-4 space-y-2 ">
                                                {children}
                                            </ul>
                                        ),
                                        ol: ({ children }) => (
                                            <ol className="list-decimal list-inside mb-4 space-y-2 ">
                                                {children}
                                            </ol>
                                        ),
                                        li: ({ children }) => <li className="ml-4">{children}</li>,
                                        blockquote: ({ children }) => (
                                            <blockquote className="border-l-4 border-blue-500 pl-4 italic  bg-gray-50 py-2 mb-4">
                                                {children}
                                            </blockquote>
                                        ),
                                        code: ({ node, className, children, ...props }) => {
                                            const match = /language-(\w+)/.exec(className || "");
                                            return match ? (
                                                <pre className="bg-gray-100 rounded-lg p-4 overflow-x-auto mb-4">
                                                    <code className={className} {...props}>
                                                        {children}
                                                    </code>
                                                </pre>
                                            ) : (
                                                <code
                                                    className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono"
                                                    {...props}
                                                >
                                                    {children}
                                                </code>
                                            );
                                        },
                                        a: ({ children, href }) => (
                                            <a
                                                href={href}
                                                className="text-blue-600 hover:text-blue-800 underline"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {children}
                                            </a>
                                        ),
                                        table: ({ children }) => (
                                            <div className="overflow-x-auto mb-4">
                                                <table className="min-w-full border-collapse border border-gray-300">
                                                    {children}
                                                </table>
                                            </div>
                                        ),
                                        th: ({ children }) => (
                                            <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-left font-semibold">
                                                {children}
                                            </th>
                                        ),
                                        td: ({ children }) => (
                                            <td className="border border-gray-300 px-4 py-2">{children}</td>
                                        ),
                                    }}
                                >
                                    {contractData.text_analysis}
                                </ReactMarkdown>

                            </div>

                        </div>
                    </TabsContent>
                    {/* end to analysis text */}
                </Tabs>
                {/* end tabs */}
            </div>
        </section>
    )
}
